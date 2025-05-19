import {useEffect, useState} from 'react';
import { useNavigate} from 'react-router-dom';

function UserHomepage(){
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState();
    const [doctors, setDoctors] = useState([]);

    useEffect(()=>{

        const fetchData = async () =>{

            try{
                const response = await fetch("http://127.0.0.1:5011/homepage", {
                    credentials: 'include',
                });
                const data = await response.json();
                if(data.success){
                    console.log(data);
                    setFirstName(data.first_name);
                    setDoctors(data.doctors);

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



    return(
        <>
        <h1>Welcome to BlueTree Health, {firstName}</h1>
        <h2>Meet Your Doctors: </h2>
        
        </>
        

       
    );

}
export default UserHomepage