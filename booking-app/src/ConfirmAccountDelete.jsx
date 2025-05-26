import { useNavigate } from "react-router-dom"
import { useCsrfToken } from "./CsrfTokenContext";

function ConfirmAccountDelete (){

    const navigate = useNavigate();
    const csrf_token = useCsrfToken();


    const fetchDelete = async(formData) => {
        try{
            const response = await fetch('http://127.0.0.1:5011/confirm_delete', {
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
               
                alert(data.message);
                location.reload();

            }
        }catch(error){
            console.log("Fetch could not be completed");
        }
    }


    function handleDeleteAccount(event){
        event.preventDefault();
        const formData = new FormData(event.target);
        fetchDelete(formData);
    }

    return(
        <>
        <div className="delete-account-form">
            <form onSubmit={handleDeleteAccount}>
                <label for="delete-email">Email</label>
                <input type="email" id="delete-email" name="delete-email" required/>
                <label for="delete-password">Password</label>
                <input type="password" id="delete-password" name="delete-password"required/>
                <input type="hidden" id="csrf_token" name="csrf_token" value={csrf_token.csrfToken}/>
                <p>By submitting this form, you are agreeing to delete your account.</p>
                <p>Please note, this action is irreversible and all appointment and account data will be inaccessbile and lost.</p>
                <button type="submit">Delete Your Account</button>
            </form>

        </div>
        </>
    );


}
export default ConfirmAccountDelete