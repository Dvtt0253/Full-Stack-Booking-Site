import {useEffect, useState} from 'react';
import { useNavigate} from 'react-router-dom';
import NavLogo from './NavLogo.jsx';
import { useCsrfToken } from './CsrfTokenContext.jsx';
import MobileNav from './MobileNav.jsx';
import NewLogo from './NewLogo.jsx';




function UserHomepage(){
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [alldoctors, setDoctors] = useState([]);
    const [doctorsAvail, setDoctorsAvail] = useState([]);
    const csrf_token = useCsrfToken();
   

    useEffect(()=>{

        
       

        const fetchData = async () =>{

            try{
                const response = await fetch("http://127.0.0.1:5011/homepage", {
                    credentials: 'include',
                    headers: {
                    'X-CSRFToken': csrf_token.csrfToken,

                },
                });
                const data = await response.json();
                if(data.success){
                    console.log(data);
                    setFirstName(data.first_name);
                    setLastName(data.last_name);
                    console.log(`firstName:${firstName}`);
                    console.log(`lastName:${lastName}`);
                    setDoctors(data.doctors);
                    console.log(`alldoctors: ${alldoctors}`);
                    
               

                }
                else{
                    console.log("Render Not Successful");
                    alert("Render Not Successful");
                }


            }catch(error){
                console.error("Error", error);
                alert("Response Not Found");
            }

        }

        

        fetchData()
        

    }, [])

    const fetchAvail = async (formData) => {
        try{
            const response = await fetch('http://127.0.0.1:5011/send_avail', {
                method: 'POST',
                body: formData, 
                credentials: 'include',
            });
            const data = await response.json();
            if(data.success){
                setDoctorsAvail(data.avail);
                console.log('Avail data receieved successfully');
                console.log(data.avail);
            }
        }catch(error){
            console.log("Fetch couldn't be completed");
            alert("Fetch couldn't be completed");
            
        }
    }
    const fetchBookingSubmit = async (formData) => {
        try{
            const response = await fetch ('http://127.0.0.1:5011/submit_booking', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrf_token.csrfToken,

                },
                
                
  
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
                navigate('/booking_page');

            }
            else{

              if (process.env.NODE_ENV === 'development') {
                    console.log("Response error");
                    }
            }

        }catch(error){
           if (process.env.NODE_ENV === 'development') {
                    console.log("Fetch could not be completed");
                    }
           
        }
    }

    function showBookForm(doctorID){
        const homepage = document.getElementById("doctor-homepage");
        const bookingForm = document.getElementById('booking-form');
        const hiddenInput = document.getElementById("chosen-doctor-id");
        
        
        homepage.style.display = 'none';
        bookingForm.style.display = 'block';
        hiddenInput.value = doctorID;
        console.log(hiddenInput.value);
       alldoctors.map((doctor) => {
         if(doctor.id === doctorID){
            document.getElementById("chosen-doctor-photo").src = doctor.headshot;
            document.getElementById('chosen-doctor-name').textContent = doctor.doctor_name;
            document.getElementById('chosen-doctor-email').textContent = doctor.contact_email;
            document.getElementById('chosen-doctor-photo').src = doctor.headshot;

         }
       })
      

       
       
    }

    function handleSubmit(event){
        event.preventDefault();
        const formData = new FormData(event.target);
        fetchAvail(formData);
    }
    function handleBookingSubmit(event){
        event.preventDefault();
        const formData = new FormData(event.target);
        fetchBookingSubmit(formData);
    }
    function reloadHomepage(){
        location.reload()
    }
    



    return(
        <>
        
        <div className="mobile-nav-logo">
        <a href="#" onClick={reloadHomepage}>
            <NewLogo/>

        </a>
            

        </div>
        <MobileNav/>
        <div className="user-nav-div">

            <NavLogo/>

            

            <div className="user-nav-buttons">
                <button onClick={() => location.reload()}>Home</button>
             <button onClick={() => navigate('/booking_page')}>Appointments</button>
              <button onClick={() => navigate('/manage_account')}>Account</button>

            </div>
            

        </div>
        <div id="doctor-homepage">
             <h1>Welcome to BlueTree Health, {firstName}</h1>
        

        
        {alldoctors.map((doctor) => (
            <div className="doctor-div" id={`doctor-${doctor.id}`} key={doctor.id}>
                
                <img alt="doctor-photo" src={doctor.headshot}/>
                <h2>{`Dr. ${doctor.doctor_name}`}</h2>
                <p>{doctor.contact_email}</p>
                <p>{doctor.field}</p>
                <form onSubmit={handleSubmit}>
                    <input type="hidden" id="booked-id" name="booked-id" value={doctor.id}/>
                    <button onClick={() => showBookForm(doctor.id)}>{`Schedule with Dr. ${doctor.doctor_name}`}</button>

                </form>
                

              

            </div>
            
        ))}

        </div>

        <div style={{display:'none'}} id="booking-form">
           <div className="chosen-doctor-info">
             <img id="chosen-doctor-photo" alt="chosen-doctor-photo"/>
             <h2 id="chosen-doctor-name"></h2>
             <p id="chosen-doctor-email"></p>
             

           </div>
           <div className='book-form'>
            <form onSubmit={handleBookingSubmit}>
                <label for="book-patient-name">Name: </label>
                <input type="text" id="book-patient-name" name="book-patient-name" required/>
                <label for="book-reason">Reason of Appointment</label>
                <input type="text" id="book-reason" name="book-reason"/>
                <label for="scheduled-time">Select a Time: </label>
                <select name="scheduled-time" id="time-select">
                    {doctorsAvail.map((avail) => (
                        <option key={avail.avail_id} value={`${avail.day} at ${avail.time}`}>{avail.day} at {avail.time}</option>

                    ))}
                    
                </select>
                <input type="hidden" name="chosen-doctor-id" id="chosen-doctor-id"/>
                <input type="hidden" name="csrf_token" id="csrf_token" value={csrf_token.csrfToken}/>
                <button type="submit">Schedule</button>


            </form>


           </div>
           
            
        </div>
        
       
            
            

        
        
        </>
        

       
    );

}
export default UserHomepage