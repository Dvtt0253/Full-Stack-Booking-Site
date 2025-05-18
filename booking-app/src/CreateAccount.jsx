
import React from "react";
import {useState} from "react";
import { useNavigate } from "react-router-dom";


function CreateAccount(){

    const navigate = useNavigate();
   

    const createAccount = async(formData) => {
       


        try{
            const response = await fetch("http://127.0.0.1:5011/create_account", {
                method: 'POST',
                body: formData
            },

            




            )
            const data = await response.json();
            if(data.success){
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
            alert("Response not found");

        }

        



    }
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        createAccount(formData);


    }

 

    

    return(
        <div>
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
            <button type="submit">Sign Up</button>

        </form>
           

        </div>
    );

}


export default CreateAccount