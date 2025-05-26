from flask import Flask, render_template, request, session, redirect, url_for, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
import secrets
from sqlalchemy.exc import IntegrityError
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from datetime import datetime, timedelta
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import dotenv
import string
from flask_cors import CORS
from flask_session import Session
import flask_firewall



SMTP_SERVER = 'smtp.gmail.com'
SMTP_PORT = 587
sender_email = os.getenv('EMAIL')

email_password = os.getenv('EMAIL_PASSWORD')


dotenv.load_dotenv()






app = Flask(__name__)

firewall = flask_firewall.Firewall(60, 60)


app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = False  
app.config['SESSION_USE_SIGNER'] = True
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SESSION_COOKIE_SAMESITE'] = 'None'  
app.config['SESSION_COOKIE_SECURE'] = True 

Session(app)



app.secret_key = os.getenv('SECRET_KEY')
CORS(app,origins=["http://localhost:5173"], supports_credentials=True)

ph = PasswordHasher()





app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATION'] = False

app.config['SQLALCHEMY_BINDS'] = {
    'bookings_db' :'sqlite:///bookings.db',
    'doctors_db' : 'sqlite:///doctors.db',
    'availability_db': 'sqlite:///availability.db',
    'tokens_db': 'sqlite:///tokens.db'

}

db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.Text, nullable=False)
    last_name = db.Column(db.Text, nullable=False)
    email = db.Column(db.String(200), nullable=False, unique=True)
    hashed_password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(200), nullable=False, default='User')
    is_deleted = db.Column(db.Boolean, nullable=False, default=False)
    is_verified = db.Column(db.Boolean, nullable=False, default=False)
    join_date = db.Column(db.DateTime, nullable=False)


class Booking(db.Model):
    __bind_key__ = 'bookings_db'
    __tablename__ = 'booking'
    id = db.Column(db.Integer, primary_key=True)
    booking_reason = db.Column(db.Text, nullable=False)
    scheduled_time = db.Column(db.String(200), nullable=False)
    booking_placed = db.Column(db.DateTime, nullable=False)
    booked_doctor = db.Column(db.Text, nullable=False)
    booked_doctorid = db.Column(db.Integer, nullable=False)
    scheduler = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, nullable=False)
    is_cancelled = db.Column(db.Boolean, nullable=False, default=False)
  


class Doctor(db.Model):
    __bind_key__ = 'doctors_db'
    __tablename__ = 'doctor'
    id = db.Column(db.Integer, primary_key=True)
    doctor_name = db.Column(db.Text, nullable=False)
    contact_email = db.Column(db.String, nullable=False, unique=True)
    field = db.Column(db.String, nullable=False)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    headshot = db.Column(db.String(300), nullable=False)


class Availability(db.Model):
    __bind_key__ = 'availability_db'
    __tablename__ = 'availability'
    id = db.Column(db.Integer, primary_key=True)
    day = db.Column(db.Text, nullable=False)
    time = db.Column(db.Text, nullable=False)
    doctor_id = db.Column(db.Integer, nullable=False)
    is_booked = db.Column(db.Boolean, nullable=False, default=False)

class Token(db.Model):
    __bind_key__ = 'tokens_db'
    __tablename__ = 'tokens'
    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(200), nullable=False, unique=True)
    issue_date = db.Column(db.DateTime, nullable=False)
    expiry_date = db.Column(db.DateTime, nullable=False)
    user_id = db.Column(db.Integer, nullable=False)
   



    
    
    



with app.app_context():
    db.create_all()

#admin_password = ph.hash("Admin123?")
#print(admin_password)
print(datetime.now())

def create_token(length):
    alphabet = string.ascii_letters + string.digits

    token = ''.join(secrets.choice(alphabet) for _ in range(length))
    return token


def send_verification_email(html_temp, receiver, subject, token):
    try:
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = receiver
        msg['Subject'] = subject
        html_content = render_template(html_temp, verify_token = token)
        msg.attach(MIMEText(html_content, 'html'))

        with smtplib.SMTP(SMTP_SERVER,SMTP_PORT) as server:
            server.starttls()
            server.login(sender_email, email_password)
            server.sendmail(sender_email, receiver, msg.as_string())
    except Exception as e:
        print(f"Error While Sending Email.{e}")

def send_confirmation_email(html_temp, receiver, subject):
    try:
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = receiver
        msg['Subject'] = subject
        html_content = html_temp
        msg.attach(MIMEText(html_content, 'html'))

        with smtplib.SMTP(SMTP_SERVER,SMTP_PORT) as server:
            server.starttls()
            server.login(sender_email, email_password)
            server.sendmail(sender_email, receiver, msg.as_string())
    except Exception as e:
        print(f"Error While Sending Email.{str(e)}")













@app.route('/create_account', methods=['POST', 'GET'])
def create_account():

    if firewall.rate_limiter() == 429:
        return jsonify ({

            'status': 429,
            'message': "Too Many Requests."
        })
  
    first_name = firewall.santitize_input(request.form['first-name'])
    if firewall.identify_payloads(first_name) == 403:
        return jsonify({
            'status':403,
            'offense': "Payloads",
            'message': "Malicious payloads detected",
        })
    last_name = firewall.santitize_input(request.form['last-name'])
    if firewall.identify_payloads(last_name) == 403:
        return jsonify({
            'status':403,
            'offense': "Payloads",
            'message': "Malicious payloads detected",
        })
    email = firewall.santitize_input(request.form['email'].lower())
    if firewall.identify_payloads(email) == 403:
        return jsonify({
            'status':403,
            'offense': "Payloads",
            'message': "Malicious payloads detected",
        })
    password = firewall.santitize_input(request.form['password'])
    if firewall.identify_payloads(password) == 403:
        return jsonify({
            'status':403,
            'offense': "Payloads",
            'message': "Malicious payloads detected",
        })
    confirm_password = firewall.santitize_input(request.form['confirm-password'])
    if firewall.identify_payloads(confirm_password) == 403:
        return jsonify({
            'status':403,
            'offense': "Payloads",
            'message': "Malicious payloads detected",
        })
    if password == confirm_password:

        hashed_password = ph.hash(password)
    else:
        flash("Passwords don't match, Please try again.", category="error")
        return redirect(url_for('signup'))
    join_date = datetime.now()

    try:

        new_user = User(first_name=first_name, last_name=last_name, email=email, hashed_password=hashed_password, join_date=join_date)
        db.session.add(new_user)
        db.session.commit()
       
    except IntegrityError:
       return jsonify({
           'status': 400,
           'success':False,
           'message': "User Already Exists."
           
       }), 400
    added_user = User.query.filter_by(email=email).first()
    print(added_user.email)
    user_id = added_user.id
    token_issued = datetime.now()
    token_expiry = token_issued + timedelta(days=1)
 
    verification_token = create_token(32)
    new_token = Token(token=verification_token, issue_date=token_issued, expiry_date=token_expiry, user_id=user_id)
    db.session.add(new_token)
    db.session.commit()
    subject = "BlueTree Health Email Verification"
    send_verification_email("verify_email.html", added_user.email, subject, verification_token )
  

    return jsonify({
        'status': 200,
        'success':True,
        'message':"Account Created Successfully Please verify Your Email Address.",
        'token' : verification_token

        
    }), 200



@app.route('/login_auth', methods=['POST', 'GET'])
def login_auth():

    if firewall.rate_limiter() == 429:
        return jsonify({
            'status': 429,
            'message': "Too Many Login Attempts",
        })

    if firewall.login_limiter(5, 60) == 403:
        return jsonify({
            'status': 403,
            'offense': "Login Attempts",
            'message': "Too many Login attempts",

        })
    email = firewall.santitize_input(request.form['login-email'].lower())
    if firewall.identify_payloads(email) == 403:
        return jsonify({
            'status':403,
            'offense': "Payloads",
            'message': "Malicious payloads detected",
        })
    password = firewall.santitize_input(request.form['login-password'])
    if firewall.identify_payloads(password) == 403:
        return jsonify({
            'status':403,
            'offense': "Payloads",
            'message': "Malicious payloads detected",
        })

    returning_user = User.query.filter_by(email=email, is_deleted=0).first()
    if returning_user:
        if returning_user.is_verified == 1:

            try:
                ph.verify(returning_user.hashed_password, password)
            
            except VerifyMismatchError:
                
                return jsonify({
                    'success': False,
                    'message': 'Incorrect Credentials',
                })
            session['id'] = returning_user.id
            session['first_name'] = returning_user.first_name
            session['last_name'] = returning_user.last_name
            session['email'] = returning_user.email
            session['role'] = returning_user.role
            session['is_deleted'] = returning_user.is_deleted
            session['csrf_token'] = firewall.generate_CSRF_Token(32)
            

            
            
           

            return jsonify({
                'status': 200,
                'Role': returning_user.role,
                'success': True,
                'message': "User Login Successful",
                'session_csrf': session['csrf_token'],
                   



                    
                }),200
           
        else:
            
            return jsonify({
                'status': 400,
                'success':False,
                'message': 'Please Verify Your Email Address'

            })
            
        


    else:
        
        return jsonify({
            'status': 400,
            'success': False,
            'message': 'Entered Credentials Does Not Match Our Records',

        })
@app.route('/homepage')
    
        
def homepage():
    if firewall.rate_limiter() == 429:
        return jsonify({
            'status': 429,
            'message': "Too Many Requests",
        })
    try: 
        print(session)
    except Exception as e:
        print(e)
    
   
    doctors_query = Doctor.query.filter_by(is_active = 1).all()
    doctors = []
    for doctor in doctors_query:
        doctors.append({
             'id': doctor.id,
             'doctor_name': doctor.doctor_name,
             'contact_email': doctor.contact_email,
             'field': doctor.field,
             'headshot': doctor.headshot,

        })
       

    doctor_dates = Availability.query.filter_by(is_booked = 0).all()
    avail_dates = []
    for date in doctor_dates:
        avail_dates.append(date)

    return jsonify({
        'status': 200,
        'success':True,
        'first_name': session['first_name'],
        'last_name': session['last_name'],
        'doctors': doctors


    }), 200


    
    

@app.route('/submit_doctor', methods=['POST', 'GET'])
def submit_doctor():
    chosen_doctorid = firewall.santitize_input(request.form['chosen-doctor'])
    print(f"The chosen doctor is: {chosen_doctorid}")
    doctor_dates = Availability.query.filter_by(doctor_id=chosen_doctorid).all()
    avail_dates = []
    for date in doctor_dates:
        if date.is_booked == 0:
            avail_dates.append(f"{date.day} at {date.time}") 

    

    

   
    return jsonify({'avail_dates': avail_dates})


    



@app.route('/submit_booking', methods=['POST', 'GET'])
def submit_booking():
    if firewall.rate_limiter() == 429:
        return jsonify ({
            'status': 429,
            'message': "Too Many Requests", 
        })
    csrf_token = request.form['csrf_token']
    if csrf_token == session['csrf_token']:
        scheduler_name = firewall.santitize_input(request.form['book-patient-name'])
        if firewall.identify_payloads(scheduler_name) == 403:
            return jsonify({
                'status':403,
                'offense': "Payloads",
                'message': "Malicious payloads detected",
            })
        booking_reason = firewall.santitize_input(request.form['book-reason'])
        if firewall.identify_payloads(booking_reason) == 403:
            return jsonify({
                'status':403,
                'offense': "Payloads",
                'message': "Malicious payloads detected",
            })
        booked_doctorid = firewall.santitize_input(request.form['chosen-doctor-id'])
        if firewall.identify_payloads(booked_doctorid) == 403:
            return jsonify({
                'status':403,
                'offense': "Payloads",
                'message': "Malicious payloads detected",
            })
    
        requested_doctor = Doctor.query.filter_by(id=booked_doctorid).first()
        booked_doctorname = requested_doctor.doctor_name
        scheduled_time = firewall.santitize_input(request.form['scheduled-time'])
        if firewall.identify_payloads(scheduled_time) == 403:
            return jsonify({
                'status':403,
                'offense': "Payloads",
                'message': "Malicious payloads detected",
            })

        placed_date = datetime.now()
        formatted_placed_date = placed_date.strftime('%B %d, %Y')
        user_id = session['id']
        parsed_time = scheduled_time.split()
        print(parsed_time)
        booked_doctordates = Availability.query.filter_by(doctor_id=booked_doctorid).all()
        day_map = {
            'Monday': 0,
            'Tuesday':1,
            'Wednesday':2,
            'Thursday': 3,
            'Friday': 4,
            'Saturday': 5,
            'Sunday': 6
            
            
        }
        current_day = datetime.now()
        current_weekday = current_day.weekday()
        scheduled_weekday = day_map[parsed_time[0]]
        if current_weekday <= scheduled_weekday:
                difference = scheduled_weekday - current_weekday
        else:
                difference = 7 - (current_weekday - scheduled_weekday)

        scheduled_date = current_day + timedelta(days=difference)
        formatted_scheduled_date = f"{scheduled_date.strftime('%B %d, %Y')} at {parsed_time[2]} "
            


        
    # for date in booked_doctordates:

            #if parsed_time[0] == date.day and parsed_time[2] == date.time:
                #date.is_booked = 0
                #db.session.commit()
        




        new_booking = Booking(booking_reason=booking_reason, scheduled_time=scheduled_time, booking_placed=placed_date, booked_doctor=booked_doctorname, booked_doctorid=booked_doctorid, scheduler=scheduler_name, user_id=user_id)
        db.session.add(new_booking)
        db.session.commit()
        html_content = render_template('booking_confirm_email.html', date_placed=formatted_placed_date, doctor_name=booked_doctorname, scheduled_time=formatted_scheduled_date, first_name=session['first_name'], last_name=session['last_name'])
        subject =f"Your Appointment Was Scheduled Successfully, {session['first_name']}"
        send_confirmation_email(html_content, session['email'], subject)

        return jsonify ({
            'status': 200,
            'success': True,
            'message': "Your Appointment has been scheduled successfully",

        })
    else: 
        return jsonify({
            'error': True,
            'message': "Issue with verifying CSRF Token.",
        })




@app.route('/booking_page')
def booking_page():
    if firewall.rate_limiter() == 429:
        return jsonify({
            'status': 429,
            'message': "Too Many Requests",
        })
    user_id = session['id']

    user_bookings_query = Booking.query.filter_by(user_id=user_id, is_cancelled=0).all()
    user_bookings = []
    for booking in user_bookings_query:
        user_bookings.append({
            'id': booking.id,
            'patient_name': booking.scheduler,
            'booked_doctor': booking.booked_doctor,
            'booking_reason': booking.booking_reason,
            'booking_time': booking.scheduled_time,
            'user_id': booking.user_id,
        })


    cancelled_bookings_query = Booking.query.filter_by(user_id=user_id, is_cancelled=1).all()
    cancelled_bookings = []
    for booking in cancelled_bookings_query:
        cancelled_bookings.append({
            'id': booking.id,
            'patient_name': booking.scheduler,
            'booked_doctor': booking.booked_doctor,
            'booking_reason': booking.booking_reason,
            'booking_time': booking.scheduled_time,
            'user_id': booking.user_id,
        })
    active_weekdays =[]
    cancelled_weekdays = [] 
    active_times = []
    cancelled_times = []
    for booking in user_bookings_query:
        scheduled_time = booking.scheduled_time
        parsed_time = scheduled_time.split()
        active_times.append(parsed_time[2])
        active_weekdays.append(parsed_time[0])
        
    for booking in cancelled_bookings_query:
        scheduled_timecan = booking.scheduled_time
        parsed_timecan = scheduled_timecan.split()
        cancelled_times.append(parsed_timecan[2])
        cancelled_weekdays.append(parsed_timecan[0])
     
    
    day_map = {
        'Monday': 0,
        'Tuesday':1,
        'Wednesday':2,
        'Thursday': 3,
        'Friday': 4,
        'Saturday': 5,
        'Sunday': 6
        
        
    }
    current_date = datetime.now()
    current_weekday = current_date.weekday()
    target_active_weekdays = []
    target_can_weekdays = []
    for day in active_weekdays:
        if day in day_map:
            target_active_weekdays.append(day_map[day])
    
    for day in cancelled_weekdays:
        if day in day_map:
            target_can_weekdays.append(day_map[day])
    days_to_next_wd = []
    days_to_next_can_wd = []
    
    for day in target_active_weekdays:
        if current_weekday <= day:
            difference = day - current_weekday
        else:
            difference = 7 - (current_weekday - day)
        days_to_next_wd.append(difference)

    
    
    for day in target_can_weekdays:
        if current_weekday <= day:
            can_difference = day - current_weekday
        else:
            can_difference = 7 - (current_weekday - day)
        days_to_next_can_wd.append(can_difference)
    active_dates = []
    for num in days_to_next_wd:
        date = current_date + timedelta(days=num)
        active_dates.append(date)
    cancelled_dates = []
    for num in days_to_next_can_wd:
        can_date = current_date + timedelta(days=num)
        cancelled_dates.append(can_date)

    active_formatted_dates = []
    can_formatted_dates = []

    for date, time in zip(active_dates,active_times):
        str_date = date.strftime('%B %d, %Y')
        formatted_date = f"{str_date} at {time}"

        active_formatted_dates.append(formatted_date)

    for date,time in zip(cancelled_dates, cancelled_times):
        str_date2 = date.strftime('%B %d, %Y')
        formatted_datecan = f"{str_date2} at {time}"
        can_formatted_dates.append(formatted_datecan)

    zipped_active = zip(user_bookings, active_formatted_dates)
    zipped_cancelled = zip(cancelled_bookings, can_formatted_dates)

    


    



    
   
    
    return jsonify ({
        'success': True,
        'bookings': user_bookings,
        'cancelled_bookings': cancelled_bookings,
        'active_dates': active_formatted_dates,
        'cancelled_dates': can_formatted_dates,
        'zip_active': list(zipped_active),
        'zip_cancelled': list(zipped_cancelled),


    })


@app.route('/cancel_booking', methods=['POST', 'GET'])
def cancel_booking():
    if firewall.rate_limiter() == 429:
        return jsonify ({
            'status':429,
            'message': "Too Many Requests",
        })
    crsf_token = request.form['csrf_token']
    if csrf_token == session['csrf_token']:

        cancelled_booking = request.form['cancelled-appoint-id']
        cancel_booking = Booking.query.filter_by(id=cancelled_booking).first()
        scheduled_time = cancel_booking.scheduled_time
        parsed_time = scheduled_time.split()

        day_map = {
            'Monday': 0,
            'Tuesday':1,
            'Wednesday':2,
            'Thursday': 3,
            'Friday': 4,
            'Saturday': 5,
            'Sunday': 6
            
            
        }
        current_day = datetime.now()
        current_weekday = current_day.weekday()
        scheduled_weekday = day_map[parsed_time[0]]
        if current_weekday <= scheduled_weekday:
                difference = scheduled_weekday - current_weekday
        else:
                difference = 7 - (current_weekday - scheduled_weekday)

        scheduled_date = current_day + timedelta(days=difference)
        formatted_scheduled_date = f"{scheduled_date.strftime('%B %d, %Y')} at {parsed_time[2]} "
            


    
        cancel_booking.is_cancelled = 1
        db.session.commit()

        html_content = render_template('booking_cancel_email.html', doctor_name=cancel_booking.booked_doctor, scheduled_time=formatted_scheduled_date, first_name=session['first_name'], last_name=session['last_name'])
        subject =f"Your Appointment With Dr. {cancel_booking.booked_doctor} Was Cancelled"
        send_confirmation_email(html_content, session['email'], subject)


    
        return jsonify ({
            'status': 200,
            'success': True,
            'message': "Your Appointment was Cancelled Successfully!",
        })
    else:
        return jsonify ({
            'error': True,
            'message': "Issue with verifying CSRF Token",
        })


@app.route('/account_management')
def account_management():
    if firewall.rate_limiter() == 429:
        return jsonify ({
            'status':429,
            'message': "Too Many Requests",
        })
    user_id = session['id']
    current_user = User.query.filter_by(id=user_id).first()
    user_firstname = current_user.first_name
    user_lastname = current_user.last_name
    user_joindate = current_user.join_date
    user_joindate = user_joindate.strftime('%B %d, %Y')
    user_email = current_user.email
    
    
    return jsonify ({
        'status': 200,
        'success': True,
        'user_id': user_id,
        'first_name': user_firstname,
        'last_name': user_lastname,
        'join_date': user_joindate,
        'email': user_email


    })

@app.route('/change_email', methods=['POST', 'GET'])
def change_email():
    if firewall.rate_limiter() == 429:
        return jsonify ({
            'status':429,
            'message': "Too Many Requests",
        })
    csrf_token = request.form['csrf_token']
    if csrf_token == session['csrf_token']:
        user_id = session['id']
        changed_email = firewall.santitize_input(request.form['user-change-email'])
        updated_user = User.query.filter_by(id=user_id).first()
        if updated_user:
            try:
                updated_user.email = changed_email
                db.session.commit()
            

            except IntegrityError:
                return jsonify ({
                    'status': 400,
                    'success': False,
                    'message': "Email Already Exists",
                })
            html_content = render_template('email_change_confirm.html', first_name=session['first_name'], last_name=session['last_name'])
            subject =f"Your Email Was Change Successfully, {session['first_name']}"
            send_confirmation_email(html_content, changed_email, subject)

            return jsonify ({
                'status': 400,
                'success': True,
                'message': "Your email has been updated successfully",
            })
        return jsonify({
            'success': False,
            'message': "An error occurred while attempting to change your email address, please try again.",
        })
    else:
        return jsonify ({
            'error': True,
            'message': "Issue with verifying CSRF Token",
        })

@app.route('/change_password', methods=['POST', 'GET'])
def change_password():
    if firewall.rate_limiter() == 429:
        return jsonify ({
            'status':429,
            'message': "Too Many Requests",
        })
    csrf_token = request.form['csrf_token']
    if csrf_token == session['csrf_token']:

        user_id = session['id']
        old_password = firewall.santitize_input(request.form['user-old-password'])
        if firewall.identify_payloads(old_password) == 403:
            return jsonify({
                'status':403,
                'offense': "Payloads",
                'message': "Malicious payloads detected",
            })
        new_password = firewall.santitize_input(request.form['user-new-password'])
        if firewall.identify_payloads(new_password) == 403:
            return jsonify({
                'status':403,
                'offense': "Payloads",
                'message': "Malicious payloads detected",
            })
        confirmed_change = firewall.santitize_input(request.form['confirm-new-password'])
        if firewall.identify_payloads(confirmed_change) == 403:
            return jsonify({
                'status':403,
                'offense': "Payloads",
                'message': "Malicious payloads detected",
            })
        updated_user = User.query.filter_by(id=user_id).first()
        if updated_user:
            try:
                ph.verify(updated_user.hashed_password, old_password)
                if new_password == confirmed_change:
                    new_hashed = ph.hash(new_password)
                    updated_user.hashed_password = new_hashed
                    db.session.commit()
                else:
                    return jsonify ({
                        'success': False, 
                        'message': "Passwords do not match.",
                    })
            except VerifyMismatchError:
                return jsonify ({
                    'success': False,
                    'message': "Previous password is incorrect",
                })
                
            html_content = render_template('password_change_confirm.html', first_name=session['first_name'], last_name=session['last_name'])
            subject =f"Your Password Was Change Successfully, {session['first_name']}"
            send_confirmation_email(html_content, session['email'], subject)
            return jsonify ({
                'success': True, 
                'message': "Your password has been updated successfully",
            })
    else:
        return jsonify({
                'error': True,
                'message': "Issue wirh verifying CSRF Token",
            })
            
    

@app.route('/confirm_delete', methods=['POST', 'GET'])
def confirm_delete():
    if firewall.rate_limiter() == 429:
        return jsonify ({
            'status':429,
            'message': "Too Many Requests",
        })
    csrf_token = request.form['csrf_token']
    if csrf_token == session['csrf_token']:
        user_id = session['id']
        email = firewall.santitize_input(request.form['delete-email'])
        if firewall.identify_payloads(email) == 403:
            return jsonify({
                'status':403,
                'offense': "Payloads",
                'message': "Malicious payloads detected",
            })
        password = firewall.santitize_input(request.form['delete-password'])
        if firewall.identify_payloads(password) == 403:
            return jsonify({
                'status':403,
                'offense': "Payloads",
                'message': "Malicious payloads detected",
            })
        deleted_user = User.query.filter_by(id=user_id).first()
        if deleted_user:
            if deleted_user.email == email:
                try:
                    ph.verify(deleted_user.hashed_password, password)
                    deleted_user.is_deleted = 1
                    db.session.commit()
                    user_bookings = Booking.query.filter_by(user_id=user_id).all()
                    for booking in user_bookings:
                        db.session.delete(booking)
                        db.session.commit()
                except VerifyMismatchError:
                    return jsonify ({
                        'success': False,
                        'message': "Incorrect Login Information",
                    })
                html_content = render_template('delete_account_confirm.html', first_name=session['first_name'], last_name=session['last_name'])
                subject =f"We're Sorry to See You Go, {session['first_name']}"
                send_confirmation_email(html_content, session['email'], subject)
                session.clear()
                return jsonify({
                    'success': True,
                    'message': "Your account has been deleted successfully",
                })
    else: 
        return jsonify({
            'error': True,
            'message': "Issue with verifying CSRF Token",
        })
                    






@app.route('/add_admin')
def add_admin():
    first_name = "Admin"
    last_name = "Account"
    email = "Adminaccount56@gmail.com".lower()
    password = ph.hash("Admin123?")
    role = "Admin"
    join_date = datetime.now()
    is_verified = 1
    new_user = User(first_name=first_name, last_name=last_name, email=email, hashed_password=password, role=role, is_verified=is_verified, join_date=join_date )
    db.session.add(new_user)
    db.session.commit()


@app.route('/admin_homepage')
def admin_homepage():
    if firewall.rate_limiter() == 429:
        return jsonify ({
            'status':429,
            'message': "Too Many Requests",
        })
    active_users_query = User.query.filter_by(is_deleted=0).all()
    deleted_users_query = User.query.filter_by(is_deleted=1).all()
    deleted_users = []
    for user in deleted_users_query:
        deleted_users.append({
            'id': user.id,
            'first_name': user.first_name,
            'email': user.email,
            'role': user.role,
            'join_date': user.join_date,
        })
    active_users = []
    i = 0
    for user in active_users_query:
        i += 1 
        user_length = i
        active_users.append({
            'id': user.id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'role': user.role,
            'join_date': user.join_date,

        })
    active_appointments_query = Booking.query.filter_by(is_cancelled=0).all()
    active_appointments = []
    for appoint in active_appointments_query:
        active_appointments.append({
            'appoint_id': appoint.id,
            'scheduler': appoint.scheduler,
            'appoint_reason': appoint.booking_reason,
            'booked_date': appoint.scheduled_time,
            'booking_placed': appoint.booking_placed,
            'booked_doctor': appoint.booked_doctor,
            'booked_doctorid': appoint.booked_doctorid,
            'user_id': appoint.user_id,



        })
    cancelled_appointments_query = Booking.query.filter_by(is_cancelled=1).all()

    cancelled_appointments = []
    for appoint in cancelled_appointments_query:
        cancelled_appointments.append({
            'appoint_id': appoint.id,
            'scheduler': appoint.scheduler,
            'appoint_reason': appoint.booking_reason,
            'booked_date': appoint.scheduled_time,
            'booking_placed': appoint.booking_placed,
            'booked_doctor': appoint.booked_doctor,
            'booked_doctorid': appoint.booked_doctorid,
            'user_id': appoint.user_id,
        })

    active_doctors_query = Doctor.query.filter_by(is_active=1).all()
    active_doctors = []
    for doctor in active_doctors_query:
        active_doctors.append({
            'id': doctor.id,
            'doctor_name': doctor.doctor_name,
            'contact_email': doctor.contact_email,
            'field': doctor.field,
            'headshot': doctor.headshot,
        })

    inactive_doctors_query = Doctor.query.filter_by(is_active=0).all()
    inactive_doctors = []
    for doctor in inactive_doctors_query:
        inactive_doctors.append({
            'id': doctor.id,
            'doctor_name': doctor.doctor_name,
            'contact_email': doctor.contact_email,
            'field': doctor.field,
            'headshot': doctor.headshot,

        })

    j = 0
    doctor_length = 0
    for doctor in active_doctors:
        j += 1
        doctor_length = j

    doctor_availability_query = Availability.query.all()
    doctor_availability = []
    for avail in doctor_availability_query:
        doctor_availability.append({
            'id': avail.id,
            'day': avail.day,
            'time': avail.time,
            'doctor_id': avail.doctor_id,
        })

    
    
    return jsonify({
        'success': True,
        'message': 'Admin Homepage Rendered Successfully.',
        'user_length': user_length,
        'doctor_length': doctor_length,
        'active_appointments': active_appointments,
        'active_users': active_users,
        'active_doctors': active_doctors,
        'availability' : doctor_availability,
        'deleted_users': deleted_users,
        'inactive_doctors': inactive_doctors,
        'deleted_appointments':cancelled_appointments


    }), 200
    


    

@app.route('/admin_users', methods=['POST', 'GET'])
def admin_users():
    if firewall.rate_limiter() == 429:
        return jsonify ({
            'status':429,
            'message': "Too Many Requests",
        })
    csrf_token = request.form['csrf_token']
    if csrf_token == session['csrf_token']:
        changed_first = firewall.santitize_input(request.form['edit-firstname'])
        if firewall.identify_payloads(changed_first) == 403:
            return jsonify({
                'status':403,
                'offense': "Payloads",
                'message': "Malicious payloads detected",
            })
        changed_last = firewall.santitize_input(request.form['edit-lastname'])
        if firewall.identify_payloads(changed_last) == 403:
            return jsonify({
                'status':403,
                'offense': "Payloads",
                'message': "Malicious payloads detected",
            })
        changed_email = firewall.santitize_input(request.form['edit-user-email'])
        if firewall.identify_payloads(changed_email) == 403:
            return jsonify({
                'status':403,
                'offense': "Payloads",
                'message': "Malicious payloads detected",
            })
        changed_role = firewall.santitize_input(request.form['edit-role'])
        if firewall.identify_payloads(changed_role) == 403:
            return jsonify({
                'status':403,
                'offense': "Payloads",
                'message': "Malicious payloads detected",
            })
        user_id = firewall.santitize_input(request.form['edited-userid'])
        if firewall.identify_payloads(user_id) == 403:
            return jsonify({
                'status':403,
                'offense': "Payloads",
                'message': "Malicious payloads detected",
            })
    

        user_to_change = User.query.filter_by(id=user_id).first()
    
    
        if user_to_change:
            if changed_first:
                user_to_change.first_name = changed_first
            if changed_last:
                user_to_change.last_name = changed_last
            if changed_email:
                user_to_change.email = changed_email
            if changed_role:
                user_to_change.role = changed_role
            db.session.commit()

            return jsonify({
                'success': True,
                'message': 'User Info Change Successfully',
            })
    else:
        return jsonify({
            'error': True,
            'message': "Issue with verifying CSRF Token",
        })







@app.route('/admin_doctors', methods=['POST', 'GET'])
def admin_doctors():
    if firewall.rate_limiter() == 429:
        return jsonify ({
            'status':429,
            'message': "Too Many Requests",
        })
    csrf_token = request.form['csrf_token']
    if csrf_token == session['csrf_token']:
        changed_name = firewall.santitize_input(request.form['edit-doctor-name'])
        if firewall.identify_payloads(changed_name) == 403:
            return jsonify({
                'status':403,
                'offense': "Payloads",
                'message': "Malicious payloads detected",
            })
        changed_contact = firewall.santitize_input(request.form['edit-doctor-email'])
        if firewall.identify_payloads(changed_contact) == 403:
            return jsonify({
                'status':403,
                'offense': "Payloads",
                'message': "Malicious payloads detected",
            })
        changed_field = firewall.santitize_input(request.form['edit-doctor-field'])
        if firewall.identify_payloads(changed_field) == 403:
            return jsonify({
                'status':403,
                'offense': "Payloads",
                'message': "Malicious payloads detected",
            })
        changed_photo = firewall.santitize_input(request.form['edit-doctor-photo'])
        if firewall.identify_payloads(changed_photo) == 403:
            return jsonify({
                'status':403,
                'offense': "Payloads",
                'message': "Malicious payloads detected",
            })
        doctor_id = firewall.santitize_input(request.form['edited-doctorid'])
        if firewall.identify_payloads(doctor_id) == 403:
            return jsonify({
                'status':403,
                'offense': "Payloads",
                'message': "Malicious payloads detected",
            })
        doctor_to_change = Doctor.query.filter_by(id=doctor_id).first()
        if doctor_to_change:
            if changed_name:
                doctor_to_change.doctor_name = changed_name
            if changed_contact:
                doctor_to_change.contact_emai = changed_contact
            if changed_field:
                doctor_to_change.field = changed_field
            if changed_photo:
                doctor_to_change.headshot = changed_photo
            db.session.commit()
            return jsonify ({
                'success': True,
                'message': 'Doctor change has been submitted successfully'
            })
    else: 
        return jsonify({
            'error': True,
            'message': "Issue with verifying CSRF Token",
        })   
@app.route('/admin_avail', methods=['POST', 'GET'])
def admin_avail():
    if firewall.rate_limiter() == 429:
        return jsonify ({
            'status':429,
            'message': "Too Many Requests",
        })
    csrf_token = request.form['csrf_token']
    if csrf_token == session['csrf_token']:
        changed_day = firewall.santitize_input(request.form['edit-day'])
        if firewall.identify_payloads(changed_day) == 403:
            return jsonify({
                'status':403,
                'offense': "Payloads",
                'message': "Malicious payloads detected",
            })
        changed_time = firewall.santitize_input(request.form['edit-time'])
        if firewall.identify_payloads(changed_time) == 403:
            return jsonify({
                'status':403,
                'offense': "Payloads",
                'message': "Malicious payloads detected",
            })
        avail_id = firewall.santitize_input(request.form['edited-availid'])
        if firewall.identify_payloads(avail_id) == 403:
            return jsonify({
                'status':403,
                'offense': "Payloads",
                'message': "Malicious payloads detected",
            })
        avail_to_change = Availability.query.filter_by(id=avail_id).first()
        if avail_to_change:
            if changed_day:
                avail_to_change.day = changed_day
            if changed_time:
                avail_to_change.time = changed_time

            db.session.commit()
            return jsonify({
                'success': True,
                'message': "Availability Update Successfully",
            })
    else:
        return jsonify ({
            'error': True,
            'message': "Issue with verifying CSRF Token"
        })

@app.route('/admin_add_user', methods=['POST', 'GET'])
def admin_add_user():
    if firewall.rate_limiter() == 429:
        return jsonify ({
            'status':429,
            'message': "Too Many Requests",
        })
    csrf_token = request.form['csrf_token']
    if csrf_token == session['csrf_token']:
        try:
            
            new_first_name = firewall.santitize_input(request.form['add-firstname'])
            if firewall.identify_payloads(new_first_name) == 403:
                return jsonify({
                    'status':403,
                    'offense': "Payloads",
                    'message': "Malicious payloads detected",
            })
            new_last_name = firewall.santitize_input(request.form['add-lastname'])
            if firewall.identify_payloads(new_last_name) == 403:
                return jsonify({
                    'status':403,
                    'offense': "Payloads",
                    'message': "Malicious payloads detected",
            })
            new_email = firewall.santitize_input(request.form['add-useremail'].lower())
            if firewall.identify_payloads(new_email) == 403:
                return jsonify({
                    'status':403,
                    'offense': "Payloads",
                    'message': "Malicious payloads detected",
            })
            new_password = firewall.santitize_input(request.form['add-password'])
            if firewall.identify_payloads(new_password) == 403:
                return jsonify({
                    'status':403,
                    'offense': "Payloads",
                    'message': "Malicious payloads detected",
            })
            
            confirm_password = firewall.santitize_input(request.form['confirm-password'])
            if firewall.identify_payloads(confirm_password) == 403:
                return jsonify({
                    'status':403,
                    'offense': "Payloads",
                    'message': "Malicious payloads detected",
            })
            if new_password == confirm_password:
                new_password = ph.hash(new_password)
            else:
                return jsonify({
                    'success':False,
                    'message': 'Passwords do not match'
                })
            
            new_role = request.form['add-role'] or "User"
            is_verified = 1
        
            
            join_date = datetime.now()

            new_user = User(first_name=new_first_name, last_name=new_last_name, email=new_email, hashed_password=new_password, role=new_role, join_date=join_date, is_verified=is_verified)

            db.session.add(new_user)
            db.session.commit()
        except IntegrityError:
            return jsonify ({
                'success': False,
                'message': 'User Already Exists',

            })


        return jsonify ({
            'success': True,
            'message': 'User Added Successfully'
        })
    else:
        return jsonify({
            'error':True,
            'message': "Issue with verifying CSRF Token"
        })

@app.route('/admin_add_doctor', methods=['POST', 'GET'])
def admin_add_doctor():
    if firewall.rate_limiter() == 429:
        return jsonify ({
            'status':429,
            'message': "Too Many Requests",
        })
    csrf_token = request.form['csrf_token']
    if csrf_token == session['csrf_token']:
        new_doctor_name = firewall.santitize_input(request.form['add-doctorname'])
        if firewall.identify_payloads(new_doctor_name) == 403:
                return jsonify({
                    'status':403,
                    'offense': "Payloads",
                    'message': "Malicious payloads detected",
            })
        new_doctor_email = firewall.santitize_input(request.form['add-doctoremail'])
        if firewall.identify_payloads(new_doctor_email) == 403:
                return jsonify({
                    'status':403,
                    'offense': "Payloads",
                    'message': "Malicious payloads detected",
            })
        new_doctor_field = firewall.santitize_input(request.form['add-doctorfield'])
        if firewall.identify_payloads(new_doctor_field) == 403:
                return jsonify({
                    'status':403,
                    'offense': "Payloads",
                    'message': "Malicious payloads detected",
            })
        new_doctor_headshot =  firewall.santitize_input(request.form['add-headshot'])
        if firewall.identify_payloads(new_doctor_headshot) == 403:
                return jsonify({
                    'status':403,
                    'offense': "Payloads",
                    'message': "Malicious payloads detected",
            })
        
        new_doctor = Doctor(doctor_name=new_doctor_name, contact_email=new_doctor_email, field=new_doctor_field, headshot=new_doctor_headshot)
        db.session.add(new_doctor)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Doctor Added Successfully',

        })
    else:
        return jsonify({
            'error':True,
            'message': "Issue with verifying CSRF Token"
        })


@app.route('/admin_add_avail', methods=['POST', 'GET'])
def admin_add_avail():
    if firewall.rate_limiter() == 429:
        return jsonify ({
            'status':429,
            'message': "Too Many Requests",
        })
    csrf_token = request.form['csrf_token']
    if csrf_token == session['csrf_token']:

        doctor_id = firewall.santitize_input(request.form['add-availdoctor'])
        if firewall.identify_payloads(doctor_id) == 403:
                return jsonify({
                    'status':403,
                    'offense': "Payloads",
                    'message': "Malicious payloads detected",
            })
        new_day = firewall.santitize_input(request.form['add-day'])
        if firewall.identify_payloads(new_day) == 403:
                return jsonify({
                    'status':403,
                    'offense': "Payloads",
                    'message': "Malicious payloads detected",
            })
        new_time = firewall.santitize_input(request.form['add-time'])
        if firewall.identify_payloads(new_time) == 403:
                return jsonify({
                    'status':403,
                    'offense': "Payloads",
                    'message': "Malicious payloads detected",
            })

        new_avail = Availability(doctor_id=doctor_id, day=new_day, time=new_time)
        db.session.add(new_avail)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': "Availability added successfully",
        })
    else:
        return jsonify({
            'error':True,
            'message': "Issue with verifying CSRF Token"
        })

@app.route('/admin_delete_user', methods=['POST', 'GET'])
def admin_delete_user():
    if firewall.rate_limiter() == 429:
        return jsonify ({
            'status':429,
            'message': "Too Many Requests",
        })
    csrf_token = request.form['csrf_token']
    if csrf_token == session['csrf_token']:
        deleted_user_id = firewall.santitize_input(request.form['deleted-userid'])
        if firewall.identify_payloads(deleted_user_id) == 403:
                return jsonify({
                    'status':403,
                    'offense': "Payloads",
                    'message': "Malicious payloads detected",
            })
        deleted_user = User.query.filter_by(id=deleted_user_id).first()
        if deleted_user:
            deleted_user.is_deleted = 1
            db.session.commit()

        return jsonify({
            'success': True,
            'message': "User deleted successfully",
        })
    else:
        return jsonify({
            'error': True,
            'message': "Issue with verifying CSRF Token"
        })
        

@app.route('/admin_delete_doctor', methods=['POST', 'GET'])
def admin_delete_doctor():

    if firewall.rate_limiter() == 429:
        return jsonify ({
            'status':429,
            'message': "Too Many Requests",
        })
    csrf_token = request.form['csrf_token']
    if csrf_token == session['csrf_token']:
        deleted_doctor_id = firewall.santitize_input(request.form['deleted-doctorid'])
        if firewall.identify_payloads(deleted_doctor_id) == 403:
                return jsonify({
                    'status':403,
                    'offense': "Payloads",
                    'message': "Malicious payloads detected",
            })
        deleted_doctor = Doctor.query.filter_by(id=deleted_doctor_id).first()
        if deleted_doctor:
            deleted_doctor.is_active = 0
            db.session.commit()

        return jsonify({
            'success': True,
            'message': "Doctor deleted successfully",

        })
    else:
        return jsonify({
            'error': True,
            'message': "Issue with verifying CSRF Token"
        })


@app.route('/admin_delete_appointment', methods=['POST', 'GET'])
def admin_delete_appointment():
    if firewall.rate_limiter() == 429:
        return jsonify ({
            'status':429,
            'message': "Too Many Requests",
        })
    csrf_token = request.form['csrf_token']
    if csrf_token == session['csrf_token']:
        deleted_appoint_id = firewall.santitize_input(request.form['deleted-appointid'])
        if firewall.identify_payloads(deleted_appoint_id) == 403:
                return jsonify({
                    'status':403,
                    'offense': "Payloads",
                    'message': "Malicious payloads detected",
            })
        deleted_booking = Booking.query.filter_by(id=deleted_appoint_id).first()
        if deleted_booking:
            deleted_booking.is_cancelled = 1
            db.session.commit()
        return jsonify({
            'success': True,
            'message': "Appointment deleted successfully",

        })
    else:
        return jsonify({
            'error': True,
            'message': "Issue with verifying CSRF Token"
        })

@app.route('/admin_appointments', methods=['POST', 'GET'])
def admin_appointments():
    if firewall.rate_limiter() == 429:
        return jsonify ({
            'status':429,
            'message': "Too Many Requests",
        })
    csrf_token = request.form['csrf_token']
    if csrf_token == session['csrf_token']:
        changed_patient = firewall.santitize_input(request.form['edit-booking-patient'])
        if firewall.identify_payloads(changed_patient) == 403:
                return jsonify({
                    'status':403,
                    'offense': "Payloads",
                    'message': "Malicious payloads detected",
            })
        changed_booked_doctor = firewall.santitize_input(request.form['edit-booked-doctor'])
        if firewall.identify_payloads(changed_booked_doctor) == 403:
                return jsonify({
                    'status':403,
                    'offense': "Payloads",
                    'message': "Malicious payloads detected",
            })
        changed_date = firewall.santitize_input(request.form['edit-booking-date'])
        if firewall.identify_payloads(changed_date) == 403:
                return jsonify({
                    'status':403,
                    'offense': "Payloads",
                    'message': "Malicious payloads detected",
            })
        changed_booking_reason = firewall.santitize_input(request.form['edit-booking-reason'])
        if firewall.identify_payloads(changed_booking_reason) == 403:
                return jsonify({
                    'status':403,
                    'offense': "Payloads",
                    'message': "Malicious payloads detected",
            })
        changed_bookingid = firewall.santitize_input(request.form['edited-appointid'])
        if firewall.identify_payloads(changed_bookingid) == 403:
                return jsonify({
                    'status':403,
                    'offense': "Payloads",
                    'message': "Malicious payloads detected",
            })

        changed_booking = Booking.query.filter_by(id=changed_bookingid).first()
        
        if changed_booking:


            if changed_patient:
                changed_booking.scheduler = changed_patient
            if changed_booked_doctor:
                changed_booking.booked_doctor = changed_booked_doctor
            if changed_date:
                changed_booking.scheduled_time = changed_date
            if changed_booking_reason:
                changed_booking.booking_reason = changed_booking_reason

            db.session.commit()
        return jsonify ({
            'success': True,
            'message': "Appointment change completed successfully.",
        })
    else:
        return jsonify({
            'error': True,
            'message': "Issue with verifying CSRF Token"
        })   

@app.route('/admin_add_appointment', methods=['POST', 'GET'])
def admin_add_appointment():
    if firewall.rate_limiter() == 429:
        return jsonify ({
            'status':429,
            'message': "Too Many Requests",
        })
    csrf_token = request.form['csrf_token']
    if csrf_token == session['csrf_token']:
        new_booking_reason = firewall.santitize_input(request.form['add-reason'])
        if firewall.identify_payloads(new_booking_reason) == 403:
                return jsonify({
                    'status':403,
                    'offense': "Payloads",
                    'message': "Malicious payloads detected",
            })
        new_scheduled_time = firewall.santitize_input(request.form['add-booked-time'])
        if firewall.identify_payloads(new_scheduled_time) == 403:
                return jsonify({
                    'status':403,
                    'offense': "Payloads",
                    'message': "Malicious payloads detected",
            })
        booking_placed = datetime.now()
        new_booked_doctor = firewall.santitize_input(request.form['add-booked-doctor'])
        if firewall.identify_payloads(new_booked_doctor) == 403:
                return jsonify({
                    'status':403,
                    'offense': "Payloads",
                    'message': "Malicious payloads detected",
            })
        new_booked_doctorid = firewall.santitize_input(request.form['add-doctorid'])
        if firewall.identify_payloads(new_booked_doctorid) == 403:
                return jsonify({
                    'status':403,
                    'offense': "Payloads",
                    'message': "Malicious payloads detected",
            })
        user_id = firewall.santitize_input(request.form['add-userid'])
        if firewall.identify_payloads(user_id) == 403:
                return jsonify({
                    'status':403,
                    'offense': "Payloads",
                    'message': "Malicious payloads detected",
            })
        new_scheduler = firewall.santitize_input(request.form['add-scheduler'])
        if firewall.identify_payloads(new_scheduler) == 403:
                return jsonify({
                    'status':403,
                    'offense': "Payloads",
                    'message': "Malicious payloads detected",
            })

        new_appoint = Booking(booking_reason=new_booking_reason, scheduled_time=new_scheduled_time, booking_placed=booking_placed, booked_doctor=new_booked_doctor, booked_doctorid=new_booked_doctorid, user_id=user_id, scheduler=new_scheduler)
        db.session.add(new_appoint)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': "Appointment Added Successfully",
            
        })
    else:
        return jsonify({
            'error': True,
            'message': "Issue with verifying CSRF Token"
        })
@app.route('/delete_deleted_users')
def delete_deleted_users():
    deleted_users = User.query.filter_by(is_deleted=1).all()
    for user in deleted_users:
        db.session.delete(user)
    db.session.commit()

@app.route('/logout', methods=['POST', 'GET'])
def logout():
    if firewall.rate_limiter() == 429:
        return jsonify ({
            'status':429,
            'message': "Too Many Requests",
        })
    session.clear()
    return jsonify ({
        'success': True,
        'message': "You have been successfully logged out",
    })
@app.route('/admin_manage_account')
def admin_manage_account():
    if firewall.rate_limiter() == 429:
        return jsonify ({
            'status':429,
            'message': "Too Many Requests",
        })
   
    user_id = session['id']
    admin_user = User.query.filter_by(id=user_id, role="Admin").first()
    first_name = admin_user.first_name
    last_name = admin_user.last_name
    role = admin_user.role
    email = admin_user.email
    join_date = admin_user.join_date
    return render_template("admin_manage.html", first_name=first_name, last_name=last_name, role=role, email=email, join_date=join_date)

@app.route('/verify_email', methods=['POST', 'GET'])
def verify_email():
    if firewall.rate_limiter() == 429:
        return jsonify ({
            'status':429,
            'message': "Too Many Requests",
        })
    token = request.args['token']
    existing_token = Token.query.filter_by(token=token).first()
    if existing_token:
        verified_user = User.query.filter_by(id=existing_token.user_id).first()
        if verified_user:
            verified_user.is_verified = 1
            db.session.commit()
            
            return redirect('http://localhost:5173/login_page')
                


        
        return "User Not Found"
    return "Token Could Not Be Verified."


@app.route("/admin_delete_avail", methods=['POST', 'GET'])
def admin_delete_avail():
    if firewall.rate_limiter() == 429:
        return jsonify ({
            'status':429,
            'message': "Too Many Requests",
        })
    csrf_token = request.form['csrf_token']
    if csrf_token == session['csrf_token']:
        deleted_avail_id = request.form['deleted-availid']
        deleted_avail = Availability.query.filter_by(id=deleted_avail_id).first()
        if deleted_avail:
            db.session.delete(deleted_avail)
            db.session.commit()
        return jsonify ({
            'success': True,
            'message': "Availability deleted successfully",
        })
    else:
        return jsonify({
            'error': True,
            'message': "Issue with verifying CSRF Token"
        })
@app.route('/send_avail', methods=['POST', 'GET'])
def send_avail():
    if firewall.rate_limiter() == 429:
        return jsonify ({
            'status':429,
            'message': "Too Many Requests",
        })
    chosen_doctor_id = firewall.santitize_input(request.form['booked-id'])
    if firewall.identify_payloads(chosen_doctor_id) == 403:
            return jsonify({
                'status':403,
                'offense': "Payloads",
                'message': "Malicious payloads detected",
        })
    doctors_avail_query = Availability.query.filter_by(doctor_id = chosen_doctor_id).all()
    doctors_avail = []
    for avail in doctors_avail_query:
        doctors_avail.append({
            'avail_id': avail.id,
            'doctor_id': avail.doctor_id,
            'day': avail.day,
            'time': avail.time,
        })

    return jsonify ({
        'success': True,
        'avail': doctors_avail,

        
    })
@app.route('/reset_password_verify', methods=['POST', 'GET'])
def reset_password_verify():
    if firewall.rate_limiter() == 429:
        return jsonify ({
            'status':429,
            'message': "Too Many Requests",
        })
    csrf_token = request.form['csrf_token']
    if csrf_token == session['csrf_token']:
        returning_email = firewall.santitize_input(request.form['reset-password-email'])
        html_content = render_template('reset_password_verify.html')
        subject = "Reset Your Password"
        returning_user = User.query.filter_by(email=returning_email).first()
        session['reset_email'] = returning_user.email
        if returning_user:
            send_confirmation_email(html_content, returning_user.email, subject )
            return jsonify({
                'success': True,
                'message': 'You will receive an email shortly to continue the process.',
            })

        else:
            return jsonify({
                'success': False,
                'message': "You will receive an email shortly to continue the process.",

    
            })
    else:
        return jsonify({
            'error': True,
            'message': "Issue with verifying CSRF Token"
        })
    
@app.route('/reset_password', methods=['POST', 'GET'])
def reset_password():
    if firewall.rate_limiter() == 429:
        return jsonify ({
            'status':429,
            'message': "Too Many Requests",
        })
    csrf_token = request.form['csrf_token']
    if csrf_token == session['csrf_token']:
        new_password = firewall.santitize_input(request.form['new-reset-password'])
        if firewall.identify_payloads(new_password) == 403:
                return jsonify({
                    'status':403,
                    'offense': "Payloads",
                    'message': "Malicious payloads detected",
            })
        new_password_confirm = firewall.santitize_input(request.form['confirm-new-password'])
        if firewall.identify_payloads(new_password_confirm) == 403:
                return jsonify({
                    'status':403,
                    'offense': "Payloads",
                    'message': "Malicious payloads detected",
            })

        if new_password == new_password_confirm:
            changed_password = ph.hash(new_password)
            user = User.query.filter_by(email = session['reset_email']).first()
            if user:
                user.hashed_password = changed_password
                db.session.commit()
                return jsonify ({
                    'success': True,
                    'message': "Your Password Has Been Reset Successfully."

                })
            else:
                return jsonify({
                    'success': False,
                    'message': "Something Went Wrong",
                })
        else: 
            return jsonify({
                'success': False,
                'message': "Passwords Do Not Match. Try Again."
            })
    else:
        return jsonify({
            'error': True,
            'message': "Issue with verifying CSRF Token"
        })
@app.route('/get_user_csrf')
def get_user_csrf():
    return jsonify({
        'success':True,
        'session_csrf': session['csrf_token']
    })

    




    


     

        













   
    







   



if __name__ == '__main__':
    app.run(debug=True, port=5011)

        
    





    