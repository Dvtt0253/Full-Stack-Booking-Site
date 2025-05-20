import {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import doctorLogo from './assets/doctor-logo.png';
import patientLogo from './assets/patient-logo.png';


function AdminHomepage(){

    const navigate = useNavigate();
    const [userLength, setUserLength] = useState();
    const [doctorLength, setDoctorLength] = useState(); 
    const [activeAppoints, setActiveAppoints] = useState([]);
    const [activeUsers, setActiveUsers] = useState([]);
    const [activeDoctors, setActiveDoctors] = useState([]);
    const [availability, setAvailability] = useState([]);
    const [deletedUsers, setDeletedUsers] = useState([]);
    const [inactiveDoctors, setInactiveDoctors] = useState([]);
    const [deletedAppoints, setDeletedAppoints] = useState([]);

    useEffect(() => {

        const fetchInfo = async () => {
            try{
                const response = await fetch('http://127.0.0.1:5011/admin_homepage', {
                    credentials: 'include'
                });

                const data = await response.json();
                if(data.success){
                    console.log(data);
                    setUserLength(data.user_length);
                    setDoctorLength(data.doctor_length);
                    setActiveAppoints(data.active_appointments);
                    setActiveUsers(data.active_users);
                    setActiveDoctors(data.active_doctors);
                    setAvailability(data.availability);
                    setDeletedUsers(data.deleted_users);
                    setInactiveDoctors(data.inactive_doctors);
                    setDeletedAppoints(data.deleted_appointments);
                    navigate('/admin_homepage');

                }
                else{
                    console.log("Request Not Successful");
                    alert("Request Not Successful");
                }

            }catch (error){
                console.error("Response Not Found", error);
                alert("Repsonse Not Found");
            }

        }

        fetchInfo();

    }, [])

    function showHome(){
        const homeDiv = document.getElementById("admin-homepage");
        if (homeDiv.style.display === "none"){
            homeDiv.style.display = "block";
            document.getElementById("admin-users").style.display = "none";
            document.getElementById("admin-doctors").style.display = "none";
            document.getElementById("admin-appoints").style.display = "none";
            document.getElementById("admin-avail").style.display = "none";
        }
        
    }
     function showUsers(){
        const userDiv = document.getElementById("admin-users");
        if (userDiv.style.display === "none"){
            userDiv.style.display = "block";
            document.getElementById("admin-homepage").style.display = "none";
            document.getElementById("admin-doctors").style.display = "none";
            document.getElementById("admin-appoints").style.display = "none";
            document.getElementById("admin-avail").style.display = "none";
        }
        
    }
     function showDoctors(){
        const doctorDiv = document.getElementById("admin-doctors");
        if (doctorDiv.style.display === "none"){
            doctorDiv.style.display = "block";
            document.getElementById("admin-users").style.display = "none";
            document.getElementById("admin-homepage").style.display = "none";
            document.getElementById("admin-appoints").style.display = "none";
            document.getElementById("admin-avail").style.display = "none";
        }
        
    }
     function showAppoints(){
        const appointDiv = document.getElementById("admin-appoints");
        if (appointDiv.style.display === "none"){
            appointDiv.style.display = "block";
            document.getElementById("admin-users").style.display = "none";
            document.getElementById("admin-doctors").style.display = "none";
            document.getElementById("admin-homepage").style.display = "none";
            document.getElementById("admin-avail").style.display = "none";
        }
        
    }
     function showAvail(){
        const availDiv = document.getElementById("admin-avail");
        if (availDiv.style.display === "none"){
            availDiv.style.display = "block";
            document.getElementById("admin-users").style.display = "none";
            document.getElementById("admin-doctors").style.display = "none";
            document.getElementById("admin-appoints").style.display = "none";
            document.getElementById("admin-homepage").style.display = "none";
        }
        
    }

    function editUser(userId){
        const userForm = document.getElementById("edit-user-form");
        const userDivs = document.querySelectorAll('.user-attribute-div');
        const hiddenInput = document.getElementById('edited-userid');
       
       
        if(userForm.style.display == 'none'){

            hiddenInput.value = userId;
            console.log(hiddenInput.value);
           
             userDivs.forEach((div, index) =>{

            div.style.display = 'none';

        }
    )
             document.getElementById(userId).style.display = 'block';
           
            userForm.style.display = 'block';
            

            
        }
        else{
            userForm.style.display = 'none';
            userDivs.forEach((userdiv, index) =>{
                userdiv.style.display = 'block';
            }
        )
        }

        




    }
    function editDoctor(doctorId){
         const doctorForm = document.getElementById("edit-doctor-form");
        const doctorDivs = document.querySelectorAll('.doctor-attribute-div');
        const hiddenInput = document.getElementById('edited-doctorid');
       
       
        if(doctorForm.style.display == 'none'){

            hiddenInput.value = doctorId;
            console.log(hiddenInput.value);
           
             doctorDivs.forEach((div, index) =>{

            div.style.display = 'none';

        }
    )
             document.getElementById(doctorId).style.display = 'block';
           
            doctorForm.style.display = 'block';
            

            
        }
        else{
            doctorForm.style.display = 'none';
            doctorDivs.forEach((doctordiv, index) =>{
                doctordiv.style.display = 'block';
            }
        )
        }

        
    }
    function editAppoint(appointId){
          const appointForm = document.getElementById("edit-appoint-form");
        const appointDivs = document.querySelectorAll('.appoint-attribute-div');
        const hiddenInput = document.getElementById('edited-appointid');
       
       
        if(appointForm.style.display == 'none'){

            hiddenInput.value = appointId;
            console.log(hiddenInput.value);
           
             appointDivs.forEach((div, index) =>{

            div.style.display = 'none';

        }
    )
             document.getElementById(appointId).style.display = 'block';
           
            appointForm.style.display = 'block';
            

            
        }
        else{
            appointForm.style.display = 'none';
            appointDivs.forEach((appointdiv, index) =>{
                appointdiv.style.display = 'block';
            }
        )
        }
        
    }
    function editAvail(availId){
          const availForm = document.getElementById("edit-avail-form");
        const availDivs = document.querySelectorAll('.avail-attribute-div');
        const hiddenInput = document.getElementById('edited-availid');
       
       
        if(appointForm.style.display == 'none'){

            hiddenInput.value = availId;
            console.log(hiddenInput.value);
           
             availDivs.forEach((div, index) =>{

            div.style.display = 'none';

        }
    )
             document.getElementById(availId).style.display = 'block';
           
            availForm.style.display = 'block';
            

            
        }
        else{
            availForm.style.display = 'none';
            availDivs.forEach((availdiv, index) =>{
                availdiv.style.display = 'block';
            }
        )
        }
        
    }
    function addUser(){

    }
    function addDoctor(){

    }
    function addAppoint(){

    }
    function addAvail(){

    }



    return(
        <>
        <body className="admin-body">

        <div className="admin-navbar">
            <div className="admin-navbuttons">
                <button onClick={showHome}>Home</button>
                <button onClick={showUsers}>Users</button>
                <button onClick={showDoctors}>Doctors</button>
                <button onClick={showAppoints}>Appointments</button>
                <button onClick={showAvail}>Availability</button>

            </div>
            

        </div>
            <div id="admin-homepage" className="admin-homepage">
            <div className="counts-div">
               
                <div className="counts">
                     <img className="counts-image" src={patientLogo}/>
                    <h3>Patients</h3>
                    <p>{userLength}</p>

                </div>
                <div className="counts">
                    <img className="counts-image" src={doctorLogo}/>
                    <h3>Doctors</h3>
                    <p>{doctorLength}</p>

                </div>

            </div>


            </div>
            <div style={{display:'none'}} id="admin-users" className="admin-users">
            <div id="user-database" className="user-database">
                <div className="attribute-table">
                    <button onClick={addUser}>Add User</button>
                    
                         {activeUsers.map((activeUser) => (

                    <div id={activeUser.id} onClick={() => editUser(activeUser.id)} key={activeUser.id} className="user-attribute-div">
                        

                        <div class="attribute-info">

                            <p><span>{activeUser.id}</span><span>{activeUser.first_name} {activeUser.last_name}</span> <span>{activeUser.email}</span> <span>{activeUser.role}</span> <span>{activeUser.join_date}</span></p>

                        </div>

                    </div>

                ))}

                    </div>
               
                    

                </div>
                <div style={{display: 'none'}} className="add-forms" id="add-user-form">
                    <form>
                        <label htmlFor="add-firstname">First Name: </label>
                        <input type="text" id="add-firstname" name="add-firstname" required/>
                        <label htmlFor="add-lastname">Last Name: </label>
                        <input type="text" id="add-lastname" name="add-lastname" required/>
                        <label htmlFor="add-useremail">Email: </label>
                        <input type="email" id="add-useremail" name="add-useremail" required/>
                        <label htmlFor="add-password">Password: </label>
                        <input type="password" id="add-password" name="add-password" required/>
                        <label htmlFor="confirm-password">Confirm Password: </label>
                        <input type="password" id="confirm-password" name="confirm-password" required/>
                        <label htmlFor="add-role">Role: </label>
                        <input type="text" id="add-role" name="add-role"/>
                        <button type="submit">Add User</button>
                    </form>

                </div>

            
                <div style={{display: 'none'}} className="edit-forms" id="edit-user-form">
                    <form>
                        <label htmlFor="edit-firstname">First Name: </label>
                        <input type="text" id="edit-firstname" name="edit-firstname"/>
                        <label htmlFor="edit-lastname">Last Name: </label>
                        <input type="text" id="edit-lastname" name="edit-lastname"/>
                        <label htmlFor="edit-user-email">Email: </label>
                        <input type="email" id="edit-user-email" name="edit-user-email"/>
                        <label htmlFor="edit-role">Role: </label>
                        <input type="text" id="edit-role" name="edit-role"/>
                        <input type="hidden" id="edited-userid" name="edited-userid"/>
                        <button type="submit">Submit Changes</button>
                    </form>

                </div>

            </div>
            <div  style={{display:'none'}} id="admin-doctors" className="admin-doctors">
                <div className="doctor-database">
                 <div className="attribute-table">
                    
                    <button onClick={addDoctor}>Add Doctor</button>
                {activeDoctors.map((activeDoctor) => (
                      <div key={activeDoctor.id} onClick={()=> editDoctor(activeDoctor.id)} class="doctor-attribute-div">
                        <div class="attribute-info">

                            <p><span>{activeDoctor.id}</span><span>{activeDoctor.doctor_name}</span><span>{activeDoctor.contact_email}</span> <span>{activeDoctor.field}</span></p>

                        </div>

                    </div>

                ))}

                  
                



                  

                </div>
                <div style={{display: 'none'}} className="edit-forms" id="doctor-edit-form">
                    <form>
                        <label htmlFor="edit-doctor-name">Name: </label>
                        <input type="text" id="edit-doctor-name" name="edit-doctor-name"/>
                        <label htmlFor="edit-doctor-email">Email: </label>
                        <input type="email" id="edit-doctor-email" name="edit-doctor-email"/>
                        <label htmlFor="edit-doctor-field">Field: </label>
                        <input type="text" id="edit-doctor-field" name="edit-doctor-field"/>
                        <label htmlFor="edit-doctor-photo">Photo Path: </label>
                        <input type="text" id="edit-doctor-photo" name="edit-doctor-photo"/>
                        <input type="hidden" id="edited-doctorid" name="edited-doctorid"/>
                        <button type="submit">Submit Changes</button>
                    </form>

                </div>
                </div>
                <div style={{display: 'none'}} className="add-forms" id="add-doctor-form">
                    <form>
                        <label htmlFor="add-doctorname">Doctor Name: </label>
                        <input type="text" id="add-doctorname" name="add-doctorname" required/>
                        <label htmlFor="add-doctoremail">Contact Email: </label>
                        <input type="email" id="add-doctoremail" name="add-doctoremail" required/>
                        <label htmlFor="add-doctorfield">Field: </label>
                        <input type="text" id="add-doctorfield" name="add-doctorfield" required/>
                        <label htmlFor="add-headshot">Photo Path: </label>
                        <input type="text" id="add-headshot" name="add-headshot" required/>
                        
                        <button type="submit">Add Doctor</button>
                    </form>

                </div>

            </div>
            <div  style={{display:'none'}} id="admin-appoints" className="admin-appoints">
                <div id="appoint-database" className="appoint-database">
                 <div className="attribute-table">
                    <button onClick={addAppoint}>Add Appointment</button>
                    {activeAppoints.map((activeAppoint) => (
                        <div onClick={() => editAppoint(activeAppoint.appoint_id)} className="appoint-attribute-div" key={activeAppoint.appoint_id}>
                        <div class="attribute-info">

                            <p><span>{activeAppoint.booked_doctor}</span> <span>{activeAppoint.booking_reason}</span> <span>{activeAppoint.booked_date}</span> <span>{activeAppoint.scheduler}</span> </p>

                        </div>

                    </div>

                    ))}
                    

                </div>
                <div style={{display: 'none'}} className="edit-forms" id="edit-appoint-form">
                    <form>
                        <label htmlFor="edit-booked-doctor">Doctor Name: </label>
                        <input type="text" id="edit-booked-doctor" name="edit-booked-doctor"/>
                        <label htmlFor="edit-booking-reason"> Date: </label>
                        <input type="text" id="edit-booking-reason" name="edit-booking-reason"/>
                        
                       
                        <label htmlFor="edit-booking-date"> Date: </label>
                        <input type="text" id="edit-booking-date" name="edit-booking-date"/>
                        <label htmlFor="edit-booking-patient"> Patient Name: </label>
                        <input type="text" id="edit-booking-patient" name="edit-booking-patient"/>
                        <input type="hidden" id="edited-appointid" name="edited-appointid"/>




                    </form>

                </div>
                </div>
                <div style={{display: 'none'}} className="add-forms" id="add-appoint-form">
                    <form>
                        <label htmlFor="add-scheduler">Patient Name: </label>
                        <input type="text" id="add-scheduler" name="add-scheduler" required/>
                        <label htmlFor="add-booked-doctor">Doctor Name: </label>
                        <input type="text" id="booked-doctor" name="add-booked-doctor" required/>
                        <label htmlFor="add-doctorid">Doctor ID: </label>
                        <input type="text" id="add-doctorid" name="add-doctorid" required/>
                        <label htmlFor="add-reason">Appointment Reason: </label>
                        <input type="text" id="add-reason" name="add-reason" required/>
                        <label htmlFor="add-booked-time">Appointment Date: </label>
                        <input type="text" id="add-booked-time" name="add-booked-time" required/>
                        


                       
                        <button type="submit">Add Appointment</button>
                    </form>

                </div>

            </div>
            <div  style={{display:'none'}} id="admin-avail" className="admin-avail">
                <div id="avail-database" className="avail-database">
                 <div onClick={editAvail} className="attribute-table">
                    <button onClick={addAvail}>Add Availability</button>
                    {availability.map((avail) => (
                        <div onClick={() => editAppoint(avail.id)} class="avail-attribute-div" key={avail.id}>
                        <div class="attribute-info">

                            <p><span>{avail.doctor_id}</span> <span>{avail.day}</span> <span>{avail.time}</span></p>

                        </div>

                    </div>

                    ))}
                   

                </div>
                <div style={{display: 'none'}} className="edit-forms" id="edit-avail-form">
                    <form>
                        <label htmlFor="edit-day">Day: </label>
                        <input type="text" id="edit-day" name="edit-day"/>
                        <label htmlFor="edit-time">Time: </label>
                        <input type="text" id="edit-time" name="edit-time"/>
                        <label htmlFor="edit-doctorid">Doctor ID: </label>
                        <input type="number" id="edit-doctorid" name="edit-doctorid"/>
                        <input type="hidden" id="edited-availid" name="edited-availid"/>
                        <button>Submit Changes</button>

                    </form>

                </div>

                </div>


            </div>
            </body>
        </>
    );

}
export default AdminHomepage