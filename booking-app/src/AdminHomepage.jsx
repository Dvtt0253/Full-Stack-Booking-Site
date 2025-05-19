import {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';

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



    return(
        <div>
            Hello Admin
        </div>
    );

}
export default AdminHomepage