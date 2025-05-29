
import React from "react";
import {useState} from "react";
import { useNavigate } from "react-router-dom";
import NewLogo from './NewLogo.jsx';


function CreateAccount(){

    const navigate = useNavigate();
   

    const createAccount = async(formData) => {
       


        try{
            const response = await fetch("http://127.0.0.1:5011/create_account", {
                method: 'POST',
                body: formData,
                credentials: 'include',
            },

            




            )
            const data = await response.json();


            if(data.status === 429){
                navigate('/429_Response');
            }
            else if(data.status === 403){
                navigate('/403_Payloads');

            }
            else if(data.success){
                const user_token = data.token;
                
                navigate('/verify_message');
                alert(data.message);
            }
            else{
                navigate('/');
                alert(data.message);
            }
        }catch(error){
            console.error("Error", error);
            navigate('/confirm_loading');

        }

        



    }
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        createAccount(formData);


    }

 

    

    return(

        <>
        <NewLogo/>
        <div className="create-account-form">
            <h2>Create An Account</h2>
        <form onSubmit={handleSubmit}>
            <label htmlFor="first-name">First Name:</label>
            <input type="text" id="first-name" name="first-name" required/>
            <label htmlFor="last-name">Last Name:</label>
            <input type="text" id="last-name" name="last-name" required/>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required/>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" required/>
            <label htmlFor="confirm-password">Confirm Password:</label>
            <input type="password" id="confirm-password" name="confirm-password" required/>
            
            <p>Already Have an Account? <a href="#" onClick={()=>navigate('/login_page')}>Sign In Here</a></p>
            <button type="submit">Sign Up</button>

        </form>
           

        </div>
        </>
        
    );

}


export default CreateAccount