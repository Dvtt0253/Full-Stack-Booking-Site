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

    return(<>

    <div className="user-active-bookings">
        {zippedActive.map(([appoint, date]) => (
            <div key={appoint.id} className="active-booking-div">
                <div className="active-booking-info">
                    <p> <span>Dr. {appoint.booked_doctor}</span> <span>{appoint.booking_reason}</span><span>{date}</span></p>
                  
                   


            </div>

        </div>

        ))}


    </div>
    </>);

}
export default BookingPage