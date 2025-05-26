import NewLogo from './NewLogo.jsx';
import { useNavigate } from 'react-router-dom';
import { useCsrfToken } from './CsrfTokenContext.jsx';

function ResetPasswordLink(){


    const navigate = useNavigate();
    const csrf_token = useCsrfToken();


    const fetchResetPassword = async (formData) => {

        try{
            const response = await fetch('http://127.0.0.1:5011/reset_password', {
                method: 'POST',
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

                navigate('/login_page');
                alert(data.message);
                
            }
            else{
                location.reload();
                alert(data.message);
            }
        }catch(error){
            console.log("Fetch could not be completed");
        }

    }


    function handlePasswordReset(event){

        event.preventDefault();
        const formData = new FormData(event.target);
        fetchResetPassword(formData);

    }

    return(<>
        <NewLogo/>
        

        <div className="reset-password-link-form">
            <h2>Reset Password</h2>
            <form onSubmit={handlePasswordReset}>
            <label for="new-reset-password">New Password: </label>
            <input type="password" id="new-reset-password" name="new-reset-password" required/>
            <label for="confirm-new-password">Confirm New Password: </label>
            <input type="password" id="confirm-new-password" name="confirm-new-password" required/>
            <input type="hidden" id="csrf_token" name="csrf_token" value={csrf_token.csrfToken}/>

            <button type="submit">Reset Password</button>


            </form>


        </div>

        
        
        
    </>);

}
export default ResetPasswordLink