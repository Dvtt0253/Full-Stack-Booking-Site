import { useNavigate } from "react-router-dom";

function Login() {

    const navigate = useNavigate();


    const handleLogin = async (formData) => {

        

        try{
            const response = await fetch('http://127.0.0.1:5011/login_auth',{
                method: 'POST',
                body: formData
            },

            
              
            )
            const data = await response.json();
            if(data.success && data.Role === "User"){
                navigate('/homepage');

            }
            else if(data.success && data.Role === "Admin"){
                navigate('/admin_homepage')
            }
            else{

                navigate('/login_page');
                alert(data.message);
            }
        }catch(error){
            console.log("Response Not found");
            alert("Response Not Found");
        }





    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        handleLogin(formData);

    }

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="login-email">Email:</label>
                <input type="email" id="login-email" name="login-email" required/>
                <label htmlFor="login-password">Password:</label>
                <input type="password" id="login-password" name="login-password" required/>
                <button type="submit">Log In</button>
               

            </form>
        </div>
    );

}
export default Login