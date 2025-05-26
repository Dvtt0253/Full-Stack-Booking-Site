import {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import doctorLogo from './assets/doctor-logo.png';
import patientLogo from './assets/patient-logo.png';
import AdminProfilePic from './assets/admin-profile.png';
import NavLogo from './NavLogo.jsx';
import { useCsrfToken } from './CsrfTokenContext.jsx';


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
    const csrf_token = useCsrfToken();

    useEffect(() => {

        const fetchInfo = async () => {
            try{
                const response = await fetch('http://127.0.0.1:5011/admin_homepage', {
                    credentials: 'include'
                });

                const data = await response.json();
                if(data.status === 429){
                    navigate('/429_Response');

                }
                else if(data.status === 403){
                    navigate('403_Payloads');
                }
                else if(data.success){
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

    const fetchUserAdd = async (formData) => {
        try{
            const response = await fetch('http://127.0.0.1:5011/admin_add_user', {
                method : 'POST',
                body: formData,
                credentials: 'include'


        });
            const data = await response.json();
            if(data.status === 429){
                navigate('/429_Response');
            }
            else if(data.status === 403){
                navigate('/403_Payloads');

            }
            else if(data.success){
              
                alert(data.message);
                location.reload();

            }
            else{
               
                alert(data.message);
                location.reload();
            }
        }catch(error){
            console.log("Error fetching repsonse");
            alert("Error fetching response");
        }
    }

    const fetchDoctorAdd = async (formData) => {

        try{
            const response = await fetch('http://127.0.0.1:5011/admin_add_doctor', {
                method : 'POST',
                body: formData,
                credentials: 'include',
            });
            const data = await response.json();
            if(data.status === 429){
                navigate('/429_Response');
            }
            else if(data.status === 403){
                navigate('/403_Payloads');

            }
            else if(data.success){
              
                alert(data.message);
                location.reload();
            }
            else{
               
                alert("Unsuccessfull add");
                location.reload();
            }
        }catch(error){
            console.error("Error", error);
            alert("Repsonse could not be fetched");
        }

    }
    const fetchAppointAdd = async (formData) => {
        try{
            const response = await fetch('http://127.0.0.1:5011/admin_add_appointment', {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });
            const data = await response.json();
            if(data.status === 429){
                navigate('/429_Response');
            }
            else if(data.status === 403){
                navigate('/403_Payloads');

            }
            else if(data.success){
                alert(data.message);
                location.reload();
            }
            else{
                alert("Appointment could not be created successfully");
                location.reload();
            }
            
        }catch(error){
            alert("Response could not be fetched");
            console.log("Response could not be fetched");
        }
    }
    const fetchAvailAdd = async (formData) => {
        try{
            const response = await fetch('http://127.0.0.1:5011/admin_add_avail', {
                method: 'POST',
                body: formData,
                credentials : 'include',
            });
            const data = await response.json();
            if(data.status === 429){
                navigate('/429_Response');
            }
            else if(data.status === 403){
                navigate('/403_Payloads');

            }
            else if(data.success){
                alert(data.message);
                location.reload();
            }
            else{
                alert("Availability could not be added successfully");
                location.reload();
            }

        }catch(error){
            console.log("Response could not be fetched");
            alert("Response could not be fetched.");
        }
    }
    const fetchUserChange = async (formData) =>{

        try{
            const response = await fetch('http://127.0.0.1:5011/admin_users', {
                method : "POST", 
                body: formData,
                credentials: 'include',

            });
            const data = await response.json();
            if(data.status === 429){
                navigate('/429_Response');
            }
            else if(data.status === 403){
                navigate('/403_Payloads');

            }
            else if(data.success){
                alert(data.message);
                location.reload();
            }
            else{
                alert("Change could not be submitted");
                location.reload();
            }
        }catch(error){
            console.log("Response could not be fetched");
            alert("Response could not be fetched");
        }

    }
    const fetchDoctorChange = async (formData) => {
        try{
            const response = await fetch('http://127.0.0.1:5011/admin_doctors', {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });
            const data = await response.json();
            if(data.status === 429){
                navigate('/429_Response');
            }
            else if(data.status === 403){
                navigate('/403_Payloads');

            }
            else if(data.success){
                alert(data.message);
                location.reload();
            }
            else{
                alert("Change could not be submitted");
                location.reload();
            }

        }catch(error){
            console.log("Response could not be fetched");
            alert("Response could not be fetched");
        }
    }
    const fetchAppointChange = async(formData) => {
        try{
            const response = await fetch('http://127.0.0.1:5011/admin_appointments', {
                method: "POST",
                body: formData,
                credentials: 'include',
            });
            const data = await response.json();
            if(data.status === 429){
                navigate('/429_Response');
            }
            else if(data.status === 403){
                navigate('/403_Payloads');

            }
            else if(data.success){
                alert(data.message);
                location.reload();
            }
            else{
                alert("Change could not be completed");
                location.reload();
            }
        }catch(error){
            console.log("Fetch could not be completed");
            alert("Fetch could not be completed");
        }
    }
    const fetchAvailChange = async(formData) => {
        try{
            const response = await fetch('http://127.0.0.1:5011/admin_avail', {
                method: 'POST', 
                body: formData,
                credentials: 'include',
            });
            const data = await response.json();
            if(data.status === 429){
                navigate('/429_Response');
            }
            else if(data.status === 403){
                navigate('/403_Payloads');

            }
            else if(data.success){
                alert(data.message);
                location.reload();
            }
            else{
                alert("Change could not be submitted successfully");
                location.reload();
            }
        }catch(error){
            console.log("Fetch not recieved");
            alert("Fetch could not be completed");
        }
    }
    const fetchUserDelete = async(formData) => {
        try{
            const response = await fetch('http://127.0.0.1:5011/admin_delete_user', {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            const data = await response.json();
            if(data.status === 429){
                navigate('/429_Response');
            }
            else if(data.status === 403){
                navigate('/403_Payloads');

            }
            else if(data.success){
                alert(data.message);
                location.reload();
            }
            else{
                alert("Delete could not be completed successfully");
                location.reload();
            }
        }catch(error){
            alert("Fetch could not be completed");
            console.log("Fetch could not be completed");
        }
    }
    const fetchDoctorDelete = async(formData) => {
        try{
            const response = await fetch("http://127.0.0.1:5011/admin_delete_doctor", {
                method : 'POST',
                body: formData,
                credentials: 'include',
            });
            const data = await response.json()
            if(data.status === 429){
                navigate('/429_Response');
            }
            else if(data.status === 403){
                navigate('/403_Payloads');

            }

            else if(data.success){
                alert(data.message);
                location.reload();
            }
            else{
                alert("Doctor could not be deleted");
                location.reload();
            }
        }catch(error){
            console.log("Fetch could not be completed");
            alert("Fetch could not be completed");
        }
    }
     const fetchAppointDelete = async(formData) => {
        try{
            const response = await fetch("http://127.0.0.1:5011/admin_delete_appointment", {
                method : 'POST',
                body: formData,
                credentials: 'include',
            });
            const data = await response.json()
            if(data.status === 429){
                navigate('/429_Response');
            }
            else if(data.status === 403){
                navigate('/403_Payloads');

            }

            else if(data.success){
                alert(data.message);
                location.reload();
            }
            else{
                alert("Appointment could not be deleted");
                location.reload();
            }
        }catch(error){
            console.log("Fetch could not be completed");
            alert("Fetch could not be completed");
        }
    }
    const fetchAvailDelete= async(formData) => {
        try{
            const response = await fetch("http://127.0.0.1:5011/admin_delete_avail", {
                method : 'POST',
                body: formData,
                credentials: 'include',
            });
            const data = await response.json()
            if(data.status === 429){
                navigate('/429_Response');
            }
            else if(data.status === 403){
                navigate('/403_Payloads');

            }

            else if(data.success){
                alert(data.message);
                location.reload();
            }
            else{
                alert("Availability could not be deleted");
                location.reload();
            }
        }catch(error){
            console.log("Fetch could not be completed");
            alert("Fetch could not be completed");
        }
    }


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
        const hiddenDeleted = document.getElementById("deleted-userid");
       
       
        if(userForm.style.display == 'none'){

            hiddenInput.value = userId;
            hiddenDeleted.value = userId;
            console.log(hiddenInput.value);
           
             userDivs.forEach((div, index) =>{

            div.style.display = 'none';

        }
    )
             document.getElementById(`user-${userId}`).style.display = 'block';
           
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
        console.log(doctorId);
        const doctorForm = document.getElementById("doctor-edit-form");
        const doctorDivs = document.querySelectorAll('.doctor-attribute-div');
        const hiddenInput = document.getElementById('edited-doctorid');
        const hiddenDeleted = document.getElementById('deleted-doctorid');

        if(doctorForm.style.display == 'none'){
            hiddenInput.value = doctorId;
            hiddenDeleted.value = doctorId;
            doctorDivs.forEach((div1, index) => {
                div1.style.display = 'none';
            })
            document.getElementById(`doctor-${doctorId}`).style.display = 'block';
            doctorForm.style.display = 'block';
        }
        else{
            doctorForm.style.display = 'none';
            doctorDivs.forEach((div1, index) => {
                div1.style.display = 'block';
            })

        }
       

        
    }
    function editAppoint(appointId){
          const appointForm = document.getElementById("edit-appoint-form");
        const appointDivs = document.querySelectorAll('.appoint-attribute-div');
        const hiddenInput = document.getElementById('edited-appointid');
        const hiddenDeleted = document.getElementById("deleted-appointid");
       
       
        if(appointForm.style.display == 'none'){

            hiddenInput.value = appointId;
            hiddenDeleted.value = appointId;
            console.log(hiddenInput.value);
           
             appointDivs.forEach((div, index) =>{

            div.style.display = 'none';

        }
    )
             document.getElementById(`appoint-${appointId}`).style.display = 'block';
           
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
        const hiddenDelete = document.getElementById("deleted-availid");
       
       
        if(availForm.style.display == 'none'){

            hiddenInput.value = availId;
            hiddenDelete.value = availId;
            console.log(hiddenInput.value);
           
             availDivs.forEach((div, index) =>{

            div.style.display = 'none';

        }
    )
             document.getElementById(`avail-${availId}`).style.display = 'block';
           
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
        const userAddForm = document.getElementById("add-user-form");
        const userDatabase = document.getElementById("user-database");
        userAddForm.style.display = "block";
        userDatabase.style.display = "none";

    }
    function addDoctor(){
        const doctorAddForm = document.getElementById("add-doctor-form");
        const doctorDatabase = document.getElementById("doctor-database");
        doctorAddForm.style.display = "block";
        doctorDatabase.style.display = "none";

    }
    function addAppoint(){
        const appointAddForm = document.getElementById("add-appoint-form");
        const appointDatabase = document.getElementById("appoint-database");
        appointAddForm.style.display = "block";
        appointDatabase.style.display = "none";

    }
    function addAvail(){
        const availAddForm = document.getElementById("add-avail-form");
        const availDatabase = document.getElementById("avail-database");
        availAddForm.style.display = "block";
        availDatabase.style.display = "none";

    }
    function cancelAddUser(){
        const displayedForm = document.getElementById("add-user-form");
        const database = document.getElementById("user-database");
        if(displayedForm.style.display === "block"){
            displayedForm.style.display = "none";
            database.style.display = "block";
        }

    }
    function cancelAddDoctor(){
        const displayedForm = document.getElementById("add-doctor-form");
        const database = document.getElementById("doctor-database");
        if(displayedForm.style.display === "block"){
            displayedForm.style.display = "none";
            database.style.display = "block";
        }

    }
    function cancelAddAppoint(){
        const displayedForm = document.getElementById("add-appoint-form");
        const database = document.getElementById("appoint-database");
        if(displayedForm.style.display === "block"){
            displayedForm.style.display = "none";
            database.style.display = "block";
        }

    }
    function cancelAddAvail(){
        const displayedForm = document.getElementById("add-avail-form");
        const database = document.getElementById("avail-database");
        if(displayedForm.style.display === "block"){
            displayedForm.style.display = "none";
            database.style.display = "block";
        }

    }
    function handleUserSubmit(event){
        event.preventDefault();
        const formData = new FormData(event.target);
        fetchUserAdd(formData);

    }
    function handleDoctorSubmit(event){
        event.preventDefault();
        const formData = new FormData(event.target);
        fetchDoctorAdd(formData);
    }
    function handleAppointSubmit(event){
        event.preventDefault();
        const formData = new FormData(event.target);
        fetchAppointAdd(formData);
    }
    function handleAvailSubmit(event){
        event.preventDefault();
        const formData = new FormData(event.target);
        fetchAvailAdd(formData);
    }
    function showDeletedUsers(){
        const activeUserTable = document.getElementById("active-user-table");
        const deletedUserTable = document.getElementById("deleted-user-table");
        if(activeUserTable.style.display === "block"){
            activeUserTable.style.display = "none";
            deletedUserTable.style.display = "block";

        }
        else{
            deletedUserTable.style.display = "block";
        }
        

    }
    function showActiveUsers(){
        const activeUserTable = document.getElementById("active-user-table");
        const deletedUserTable = document.getElementById("deleted-user-table");
        if(activeUserTable.style.display === "none"){
            activeUserTable.style.display = "block";
            deletedUserTable.style.display = "none";

        }
        else{
            activeUserTable.style.display = "block";
        }

    }
    function showActiveDoctors(){
        const activeDoctorTable = document.getElementById("active-doctor-table");
        const deletedDoctorTable = document.getElementById("deleted-doctor-table");
        if(activeDoctorTable.style.display === "none"){
            activeDoctorTable.style.display = "block";
            deletedDoctorTable.style.display = "none";

        }
        else{
            activeDoctorTable.style.display = "block";
        }

    }
    function showInactiveDoctors(){
        const activeDoctorTable = document.getElementById("active-doctor-table");
        const deletedDoctorTable = document.getElementById("deleted-doctor-table");
        if(activeDoctorTable.style.display === "block"){
            activeDoctorTable.style.display = "none";
            deletedDoctorTable.style.display = "block";

        }
        else{
            deletedDoctorTable.style.display = "block";
        }
        

    }
    function showActiveAppoints(){
        const activeAppointTable = document.getElementById("active-appoint-table");
        const deletedAppointTable = document.getElementById("cancelled-appoint-table");
        if(activeAppointTable.style.display === "none"){
            activeAppointTable.style.display = "block";
            deletedAppointTable.style.display = "none";

        }
        else{
            activeAppointTable.style.display = "block";
        }

    }
    function showDeletedAppoints(){
        const activeAppointTable = document.getElementById("active-appoint-table");
        const deletedAppointTable = document.getElementById("cancelled-appoint-table");
        if(activeAppointTable.style.display === "block"){
            activeAppointTable.style.display = "none";
            deletedAppointTable.style.display = "block";

        }
        else{
            deletedAppointTable.style.display = "block";
        }

    }
    function handleUserChange(event){
        event.preventDefault();
        const formData = new FormData(event.target);
        fetchUserChange(formData);
    }
    function handleDoctorChange(event){
        event.preventDefault();
        const formData = new FormData(event.target);
        fetchDoctorChange(formData);

    }
    function handleAppointChange(event){
        event.preventDefault();
        const formData = new FormData(event.target);
        fetchAppointChange(formData);

    }
    function handleAvailChange(event){
        event.preventDefault();
        const formData = new FormData(event.target);
        fetchAvailChange(formData);

    }
    function handleUserDelete(event){
        event.preventDefault();
        const formData = new FormData(event.target);
        fetchUserDelete(formData);

    }
    function handleDoctorDelete(event){
        event.preventDefault();
        const formData = new FormData(event.target);
        fetchDoctorDelete(formData);
        
    }
    function handleAppointDelete(event){
        event.preventDefault();
        const formData = new FormData(event.target);
        fetchAppointDelete(formData);

        
    }
    function handleAvailDelete(event){
        event.preventDefault();
        const formData = new FormData(event.target);
        fetchAvailDelete(formData);
        
    }






    return(
        <>
        <body className="admin-body">

        <div className="admin-navbar">
            <NavLogo size={'2vw'}/>
            <div className="admin-navbuttons">
                <img className="admin-profile-pic" onClick={() => navigate('/admin_account_management')} src={AdminProfilePic}/>
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
                <div style={{display: 'block'}} id="active-user-table" className="attribute-table">
                    <button className="add-attribute-buttons" onClick={addUser}>Add User</button>
                    <button  className="toggle-attribute-buttons" onClick={showActiveUsers}>Active Users</button>
                    <button  className="toggle-attribute-buttons" onClick={showDeletedUsers}>Deleted Users</button>
                    
                         {activeUsers.map((activeUser) => (

                    <div id={`user-${activeUser.id}`} onClick={() => editUser(activeUser.id)} key={activeUser.id} className="user-attribute-div">
                        

                        <div class="attribute-info">

                            <p><span>{activeUser.id}</span><span>{activeUser.first_name} {activeUser.last_name}</span> <span>{activeUser.email}</span> <span>{activeUser.role}</span> <span>{activeUser.join_date}</span></p>

                        </div>

                    </div>
                    


                ))}
               

                    </div>
                     <div style={{display: 'none'}} id="deleted-user-table" className="attribute-table">
                        <button className="add-attribute-buttons" onClick={addUser}>Add User</button>
                    <button className="toggle-attribute-buttons" onClick={showActiveUsers}>Active Users</button>
                    <button  className="toggle-attribute-buttons" onClick={showDeletedUsers}>Deleted Users</button>
                    
                         {deletedUsers.map((deletedUser) => (

                    <div id="user-{deletedUser.id}" key={deletedUser.id} className="user-attribute-div">
                        

                        <div class="attribute-info">

                            <p><span>{deletedUser.id}</span><span>{deletedUser.first_name} {deletedUser.last_name}</span> <span>{deletedUser.email}</span> <span>{deletedUser.role}</span> <span>{deletedUser.join_date}</span></p>

                        </div>

                    </div>
                    


                ))}


                    </div>
               
                    

                </div>
                <div style={{display: 'none'}} className="add-forms" id="add-user-form">
                     <button onClick={cancelAddUser} id="cancel-user-add" className="cancel-add-button">Cancel</button>
                    <form onSubmit={handleUserSubmit}>
                        <h3>Add User</h3>
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
                        <input type="hidden" id="csrf_token" name="csrf_token" value={csrf_token.csrfToken}/>
                        <button type="submit">Add User</button>
                    </form>

                </div>

            
                <div style={{display: 'none'}} className="edit-forms" id="edit-user-form">
                    
                    <form onSubmit={handleUserChange}>
                        <h3>Edit User</h3>
                        <label htmlFor="edit-firstname">First Name: </label>
                        <input type="text" id="edit-firstname" name="edit-firstname"/>
                        <label htmlFor="edit-lastname">Last Name: </label>
                        <input type="text" id="edit-lastname" name="edit-lastname"/>
                        <label htmlFor="edit-user-email">Email: </label>
                        <input type="email" id="edit-user-email" name="edit-user-email"/>
                        <label htmlFor="edit-role">Role: </label>
                        <input type="text" id="edit-role" name="edit-role"/>
                        <input type="hidden" id="edited-userid" name="edited-userid"/>
                        <input type="hidden" id="csrf_token" name="csrf_token" value={csrf_token.csrfToken}/>
                        <button type="submit">Submit Changes</button>
                    </form>
                    <form onSubmit={handleUserDelete}>
                        <button className="delete-attribute-button" type="submit">Delete User</button>
                        <input type="hidden" id="deleted-userid" name="deleted-userid"/>
                        <input type="hidden" id="csrf_token" name="csrf_token" value={csrf_token.csrfToken}/>
                    </form>

                </div>

            </div>

            {/*Doctor database*/}



            <div  style={{display:'none'}} id="admin-doctors" className="admin-doctors">
                <div id="doctor-database" className="doctor-database">
                 <div style={{display:'block'}} id="active-doctor-table" className="attribute-table">
                    
                    <button className="add-attribute-buttons" onClick={addDoctor}>Add Doctor</button>
                    <button  className="toggle-attribute-buttons" onClick={showActiveDoctors}>Active Doctors</button>
                    <button  className="toggle-attribute-buttons" onClick={showInactiveDoctors}>Inactive Doctors</button>
                {activeDoctors.map((activeDoctor) => (
                      <div id={`doctor-${activeDoctor.id}`} key={activeDoctor.id} onClick={()=> editDoctor(activeDoctor.id)} class="doctor-attribute-div">
                        <div class="attribute-info">

                            <p><span>{activeDoctor.id}</span><span>{`Dr. ${activeDoctor.doctor_name}`}</span><span>{activeDoctor.contact_email}</span> <span>{activeDoctor.field}</span></p>

                        </div>

                    </div>

                ))}

                  
                



                  

                </div>
                <div style={{display: 'none'}} id="deleted-doctor-table" className="attribute-table">
                      <button className="add-attribute-buttons" onClick={addDoctor}>Add Doctor</button>
                      <button  className="toggle-attribute-buttons" onClick={showActiveDoctors}>Active Doctors</button>
                      <button  className="toggle-attribute-buttons" onClick={showInactiveDoctors}>Inactive Doctors</button>
                {inactiveDoctors.map((inactiveDoctor) => (
                      <div key={inactiveDoctor.id} class="doctor-attribute-div">
                        <div class="attribute-info">

                            <p><span>{inactiveDoctor.id}</span><span>{`Dr. ${inactiveDoctor.doctor_name}`}</span><span>{inactiveDoctor.contact_email}</span> <span>{inactiveDoctor.field}</span></p>

                        </div>

                    </div>

                ))}

                  
                


                </div>
                <div style={{display: 'none'}} className="edit-forms" id="doctor-edit-form">
                    <form onSubmit={handleDoctorChange}>
                         <h3>Edit Doctor</h3>
                        <label htmlFor="edit-doctor-name">Name: </label>
                        <input type="text" id="edit-doctor-name" name="edit-doctor-name"/>
                        <label htmlFor="edit-doctor-email">Email: </label>
                        <input type="email" id="edit-doctor-email" name="edit-doctor-email"/>
                        <label htmlFor="edit-doctor-field">Field: </label>
                        <input type="text" id="edit-doctor-field" name="edit-doctor-field"/>
                        <label htmlFor="edit-doctor-photo">Photo Path: </label>
                        <input type="text" id="edit-doctor-photo" name="edit-doctor-photo"/>
                        <input type="hidden" id="edited-doctorid" name="edited-doctorid"/>
                        <input type="hidden" id="csrf_token" name="csrf_token" value={csrf_token.csrfToken}/>
                        <button type="submit">Submit Changes</button>
                    </form>

                    <form onSubmit={handleDoctorDelete}>
                        <input type="hidden" id="deleted-doctorid" name="deleted-doctorid"/>
                        <input type="hidden" id="csrf_token" name="csrf_token" value={csrf_token.csrfToken}/>
                        <button className="delete-attribute-button" type="submit">Deactivate Doctor</button>
                        
                    </form>

                </div>
                </div>
                <div style={{display: 'none'}} className="add-forms" id="add-doctor-form">
                     <button onClick={cancelAddDoctor}id="cancel-doctor-add" className="cancel-add-button">Cancel</button>
                    <form onSubmit={handleDoctorSubmit}>
                        <h3>Add Doctor</h3>
                        <label htmlFor="add-doctorname">Doctor Name: </label>
                        <input type="text" id="add-doctorname" name="add-doctorname" required/>
                        <label htmlFor="add-doctoremail">Contact Email: </label>
                        <input type="email" id="add-doctoremail" name="add-doctoremail" required/>
                        <label htmlFor="add-doctorfield">Field: </label>
                        <input type="text" id="add-doctorfield" name="add-doctorfield" required/>
                        <label htmlFor="add-headshot">Photo Path: </label>
                        <input type="text" id="add-headshot" name="add-headshot" required/>
                        <input type="hidden" id="csrf_token" name="csrf_token" value={csrf_token.csrfToken}/>
                        
                        <button type="submit">Add Doctor</button>
                    </form>

                </div>

                {/*Appoint database*/}

            </div>
            <div  style={{display:'none'}} id="admin-appoints" className="admin-appoints">
                <div id="appoint-database" className="appoint-database">
                 <div style={{display:'block'}} id="active-appoint-table" className="attribute-table">
                    <button className="add-attribute-buttons" onClick={addAppoint}>Add Appointment</button>
                    <button  className="toggle-attribute-buttons" onClick={showActiveAppoints}>Active Appointments</button>
                    <button  className="toggle-attribute-buttons" onClick={showDeletedAppoints}>Cancelled Appointments</button>
                    {activeAppoints.map((activeAppoint) => (
                        <div id={`appoint-${activeAppoint.appoint_id}`} onClick={() => editAppoint(activeAppoint.appoint_id)} className="appoint-attribute-div" key={activeAppoint.appoint_id}>
                        <div class="attribute-info">

                            <p><span>{`Dr. ${activeAppoint.booked_doctor}`}</span> <span>{activeAppoint.booking_reason}</span> <span>{activeAppoint.booked_date}</span> <span>{activeAppoint.scheduler}</span> </p>

                        </div>

                    </div>

                    ))}
                    

                </div>
                <div style={{display:'none'}} id="cancelled-appoint-table" className="attribute-table">
                    <button className="add-attribute-buttons" onClick={addAppoint}>Add Appointment</button>
                    <button  className="toggle-attribute-buttons" onClick={showActiveAppoints}>Active Appointments</button>
                    <button  className="toggle-attribute-buttons" onClick={showDeletedAppoints}>Cancelled Appointments</button>
                    {deletedAppoints.map((deletedAppoint) => (
                        <div className="appoint-attribute-div" key={deletedAppoint.appoint_id}>
                        <div class="attribute-info">

                            <p><span>{`Dr. ${deletedAppoint.booked_doctor}`}</span> <span>{deletedAppoint.booking_reason}</span> <span>{deletedAppoint.booked_date}</span> <span>{deletedAppoint.scheduler}</span> </p>

                        </div>

                    </div>

                    ))}


                </div>
                <div style={{display: 'none'}} className="edit-forms" id="edit-appoint-form">
                    <form onSubmit={handleAppointChange}>
                         <h3>Edit Appointment</h3>
                        <label htmlFor="edit-booked-doctor">Doctor Name: </label>
                        <input type="text" id="edit-booked-doctor" name="edit-booked-doctor"/>
                        <label htmlFor="edit-booking-reason"> Reason: </label>
                        <input type="text" id="edit-booking-reason" name="edit-booking-reason"/>
                        
                       
                        <label htmlFor="edit-booking-date"> Date: </label>
                        <input type="text" id="edit-booking-date" name="edit-booking-date"/>
                        <label htmlFor="edit-booking-patient"> Patient Name: </label>
                        <input type="text" id="edit-booking-patient" name="edit-booking-patient"/>
                        <input type="hidden" id="edited-appointid" name="edited-appointid"/>
                        <button type="submit">Submit Changes</button>




                    </form>
                    <form onSubmit={handleAppointDelete}>
                        <input type="hidden" id="deleted-appointid" name="deleted-appointid"/>
                        <button className="delete-attribute-button" type="submit">Cancel Appointment</button>
                        
                    </form>

                </div>
                </div>
                <div style={{display: 'none'}} className="add-forms" id="add-appoint-form">
                     <button onClick={cancelAddAppoint} id="cancel-appoint-add" className="cancel-add-button">Cancel</button>
                    <form onSubmit={handleAppointSubmit}>
                        <h3>Add Appointment</h3>
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
                        <label htmlFor="add-userid">User ID</label>
                        <input type="number" id="add-userid" name="add-userid" required/>
                        <input type="hidden" id="csrf_token" name="csrf_token" value={csrf_token.csrfToken}/>
                        


                       
                        <button type="submit">Add Appointment</button>
                    </form>

                </div>

            </div>
            <div  style={{display:'none'}} id="admin-avail" className="admin-avail">
                <div id="avail-database" className="avail-database">
                 <div id="avail-table" className="attribute-table">
                    <button className="add-attribute-buttons" onClick={addAvail}>Add Availability</button>
                    {availability.map((avail) => (
                        <div id={`avail-${avail.id}`} onClick={() => editAvail(avail.id)} className="avail-attribute-div" key={avail.id}>
                        <div class="attribute-info">

                            <p><span>{avail.doctor_id}</span> <span>{avail.day}</span> <span>{avail.time}</span></p>

                        </div>

                    </div>

                    ))}
                   

                </div>
                <div style={{display: 'none'}} className="edit-forms" id="edit-avail-form">
                    <form onSubmit={handleAvailChange}>
                         <h3>Edit Availability</h3>
                        <label htmlFor="edit-day">Day: </label>
                        <input type="text" id="edit-day" name="edit-day"/>
                        <label htmlFor="edit-time">Time: </label>
                        <input type="text" id="edit-time" name="edit-time"/>
                        
                        <input type="hidden" id="edited-availid" name="edited-availid"/>
                        <input type="hidden" id="csrf_token" name="csrf_token" value={csrf_token.csrfToken}/>
                        <button>Submit Changes</button>

                    </form>
                    <form onSubmit={handleAvailDelete}>
                        <input type="hidden" id="deleted-availid" name="deleted-availid"/>
                        <input type="hidden" id="csrf_token" name="csrf_token" value={csrf_token.csrfToken}/>
                        <button className="delete-attribute-button" type="submit">Delete Availability</button>
                        
                    </form>

                </div>
                

                </div>
                <div style={{display: 'none'}} className="add-forms" id="add-avail-form">
                    <button onClick={cancelAddAvail} id="cancel-avail-add" className="cancel-add-button" >Cancel</button>
                    <form onSubmit={handleAvailSubmit}>
                        <h3>Add Availability</h3>
                        <label htmlFor="add-availdoctor">Doctor ID: </label>
                        <input type="number" id="add-availdoctor" name="add-availdoctor" required/>
                        <label htmlFor="add-day">Day: </label>
                        <input type="text" id="add-day" name="add-day" required/>
                        <label htmlFor="add-time">Time: </label>
                        <input type="text" id="add-time" name="add-time" required/>
                        <input type="hidden" id="csrf_token" name="csrf_token" value={csrf_token.csrfToken}/>
                       
                        
                        <button type="submit">Add Availability</button>
                    </form>

                </div>


            </div>
            </body>
        </>
    );

}
export default AdminHomepage