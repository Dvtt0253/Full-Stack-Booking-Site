import {useState, useEffect} from 'react';
import {navigate} from 'react';

function BookingPage(){
    const [zippedCancelled, setZippedCan] = useState([]);
    const [zippedActive, setZippedActive] = useState([]);

    useEffect(()=>{
        const fetchAppoints = async () => {
            try{
                 const response = await fetch('http://127.0.0.1:5011/booking_page',{
                    credentials: 'include',
                 });
                 const data = await response.json();
                 if(data.success){
                    console.log(data);
                    console.log("Appoints fetched successfully");
                    setZippedCan(data.zip_cancelled);
                    setZippedActive(data.zip_active);
                 }
                 else{
                    console.log("Response not found");
                    alert("response not found");
                 }
            }catch(error){
                console.log("Fetch could not be completed");
                alert("Fetch could not be completed");
            }
           
        }
        fetchAppoints()

    }, [])
    const fetchAppointCancel = async (formData) => {
        try{
            const response = await fetch('http://127.0.0.1:5011/cancel_booking', {
                method: 'POST',
                body: formData,
                credentials: 'include',

            });
            const data = await response.json();
            if(data.success){
                alert(data.message);
                location.reload();
            }
            else{
                alert("A problem occurred while cancelling your appointment");
                console.log("Problem occured");
            }
        }catch(error){

            console.log("Fetch could not be completed");
        }
    }
    function showActiveBookings(){
        const activeBookings = document.getElementById("user-active-bookings");
        const cancelledBookings = document.getElementById("user-cancelled-bookings");

        if(activeBookings.style.display === 'none'){
            activeBookings.style.display = 'block';
            cancelledBookings.style.display = 'none';
        }
       
    }
    function showCancelledBookings(){
         const activeBookings = document.getElementById("user-active-bookings");
        const cancelledBookings = document.getElementById("user-cancelled-bookings");

        if(cancelledBookings.style.display === 'none'){
            cancelledBookings.style.display = 'block';
            activeBookings.style.display = 'none';
        }

    }
    function cancelAppoint(appointID){
        const appointDivs = document.querySelectorAll('.active-booking-div');
        const cancelForm = document.getElementById('cancel-form');
        const hiddenInput = document.getElementById('cancelled-appoint-id');
        if(cancelForm.style.display === 'none'){
             appointDivs.forEach((appoint, index) => {
                appoint.style.display = 'none'
            
             })
             document.getElementById(`appoint-${appointID}`).style.display = 'block';
             hiddenInput.value = appointID;
             cancelForm.style.display = 'block';

        }
        else{
            appointDivs.forEach((appoint, index) => {
                appoint.style.display = 'block';

            })
            cancelForm.style.display = 'none';
        }
       


    }
    function handleCancel(event){
        event.preventDefault();
        const formData = new FormData(event.target);
        fetchAppointCancel(formData);
    }

    return(<>

    <div className="booking-table">
        <button onClick={showActiveBookings}>Active Appointments</button>
        <button onClick={showCancelledBookings}>Cancelled Appointments</button>

    <div id="user-active-bookings" className="user-active-bookings">
        {zippedActive.map(([appoint, date]) => (
            <div  key={appoint.id} className="active-booking-div" id={`appoint-${appoint.id}`}>
                <div className="active-booking-info">
                    
                    <p> <span>Dr. {appoint.booked_doctor}</span> <span>{appoint.booking_reason}</span><span>{date}</span><span><button onClick={()=> cancelAppoint(appoint.id)}>Cancel</button></span></p>
                    

                  
                   


            </div>

        </div>

        ))}
       


    </div>
     <div id="user-cancelled-bookings" style={{display:'none'}} className="user-cancelled-bookings">
        {zippedCancelled.map(([appoint, date]) => (
            <div key={appoint.id} className="cancelled-booking-div">
                <div className="cancelled-booking-info">
                    <p> <span>Dr. {appoint.booked_doctor}</span> <span>{appoint.booking_reason}</span><span>{date}</span></p>
                  
                   


            </div>

        </div>

        ))}


    </div>
    </div>
     <div style={{display:'none'}} id="cancel-form" className="cancel-form">
        <form onSubmit={handleCancel}>
            <input type="hidden" id="cancelled-appoint-id" name="cancelled-appoint-id"/>
            <p>By Proceeding, You are agreeing to cancel this appointment.</p>
            <p>Please note, that this action is irreversible.</p>
            <button type="submit">Cancel</button>

        </form>
           

        </div>
    </>);

}
export default BookingPage