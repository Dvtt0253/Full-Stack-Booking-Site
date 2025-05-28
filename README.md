# Full-Stack Clinic Booking Site

A web application that serves as an appointment booking and management website for a mock clinic. Patients are able to view doctors' availability, book appointments with available doctors, as well as cancel appointments. Additionally, for data managemnt, tracking, and editing , an admin dashboard is included to allow admins to add and edit users, appointments, and manage the status and availability of doctors.

## Features
- User account creation, authentication and management.
- Session Handling with Flask-Session
- Email verification and updates
- CRUD Operations:
    - Create: Patients are able to book new appointments.
    - Read: Patients are able to view upcoming appointments.
    - Update: Appointment editing and updating is limited to admins only.
    - Delete: Patients are able to cancel scheduled appointments.

## Security Features
- Integration of **Flask Firewall** to protect against common web vulnerabilities.
- Implementation of CSRF Protections through creating CSRF tokens at the start of each session to protect against cross site request foregery attacks.

## Admin Dashboard

### Features
- CRUD Operations:
    - Create: Admins are able to add and create new users, appointments, doctors, and availability times.
    - Read: Admins are able to view user, doctor, appointment, and availability data and statuses.
    - Update: Admins are able to edit user, doctor, appointment, and availability data.
    - Delete: Admins are able to delete and deactivate users, doctors, appointments, and availability times.
- Account Management
- Designed as a single-page interface to enhance efficiency and simplify navigation.

### Admin UI Demo Video

[Click here to view the demo video of the Admin Dashboard](https://drive.google.com/file/d/1nFI95mRmDS9Y4QYztcra3lkpYsQFAoug/view?usp=drive_link)


## Live Link
[Click here to access the appointment booking website](https://full-stack-booking-site-frontend.onrender.com)




## Tech Stack
- ### Frontend
 - **React**
- ### Backend
 - **Python**
 - **Flask**
 - **Flask-CORS**
 - **Flask-Session**











    
