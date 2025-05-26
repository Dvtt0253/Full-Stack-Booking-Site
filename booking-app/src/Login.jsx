import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BlueLogo from './BlueLogo.jsx'


function Login() {

    const navigate = useNavigate();
    const [csrfToken, setCsrfToken] = useState();


    const handleLogin = async (formData) => {

        

        try{
            const response = await fetch('http://127.0.0.1:5011/login_auth',{
                method: 'POST',
                body: formData,
                credentials: 'include',
            },

            
              
            )
            const data = await response.json();
            console.log(data);
            if(data.status === 403 && data.offense === "Login Attempts"){
                navigate('/403_Response');

            }
            else if(data.status === 403 && data.ofense === "Payloads"){
                navigate('403_Payloads');

            }
            else if(data.success && data.Role === "User"){

                navigate('/homepage');
                setCsrfToken(data.session_csrf);

            }
            else if(data.success && data.Role === "Admin"){
                navigate('/admin_homepage')
                setCsrfToken(data.session_csrf);
                
            }
            else{

                navigate('/login_page');
                alert(data.message);
            }
        }catch(error){
            console.log("Response Not found", error);
            alert("Response Not Found");
        }





    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        handleLogin(formData);

    }

    return(
            <>
            
            
                <BlueLogo/>
            <div className="login-form">
                    <form onSubmit={handleSubmit}>
                        <h2>Login</h2>
                        <label htmlFor="login-email">Email:</label>
                        <input type="email" id="login-email" name="login-email" required/>
                        <label htmlFor="login-password">Password:</label>
                        <input type="password" id="login-password" name="login-password" required/>
                        <p>Forgot Your Password? <a href="#"><p onClick={() => navigate('/reset_password')}>Reset Your Password Here</p></a></p>
                        <button type="submit">Log In</button>

                    

                    </form>
                </div>

            
            
            </>
        
    );
   
}

export default Login