import NewLogo from './NewLogo.jsx';
import { useNavigate} from 'react-router-dom';
import { useCsrfToken } from './CsrfTokenContext.jsx';

function ResetPassword (){

    const navigate = useNavigate();
    const csrf_token = useCsrfToken();

    const fetchPasswordReset =  async(formData) => {
        try{
            const response = await fetch('http://127.0.0.1:5011/reset_password_verify', {
                method : 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': csrf_token.csrfToken,

                },
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
                alert(data.message);
                location.reload();
            }
            else{
                alert(data.message);
                console.log("Error occured");
            }
        }catch(error){
            console.log("Fetch could not be completed.");
        }
    }


    function handlePasswordReset(event){

        event.preventDefault();
        const formData = new FormData(event.target);
        fetchPasswordReset(formData);

    }

    return(<>
        <NewLogo/>

       
        <div className="reset-password-form">
            <h2>Reset Password</h2>
            <form onSubmit={handlePasswordReset}>
                <p>If your email is connected to an existing account, you will receive an email shortly to reset you password.</p>
                <label for="reset-password-email">Email: </label>
                <input type="email" id="reset-password-email" name="reset-password-email" required/>

                <button type="submit">Submit</button>

            </form>

        </div>
    </>);

}
export default ResetPassword