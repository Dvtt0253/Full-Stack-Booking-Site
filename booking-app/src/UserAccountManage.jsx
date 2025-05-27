import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import DeleteAccount from './DeleteAccount.jsx';
import NewLogo from './NewLogo.jsx';
import { useCsrfToken } from './CsrfTokenContext.jsx';
import MobileNav from './MobileNav.jsx';

function UserAccountManage({showDelete = true, is_user = true, homepage_path='/homepage'}){
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [joinDate, setJoinDate] = useState();
    const [email, setEmail] = useState();
    const[userId, setUserId] = useState();
    const csrf_token = useCsrfToken();
    const navigate = useNavigate();
   

    useEffect(() => {
       

        const fetchUserData = async ()=>{
            try{
                const response = await fetch('http://127.0.0.1:5011/account_management', {
                    credentials: 'include',
                });

                const data = await response.json();
                if(data.success){
                    console.log(data);
                    console.log("Data fetched Successfully");
                    setFirstName(data.first_name);
                    setLastName(data.last_name);
                    setJoinDate(data.join_date);
                    setUserId(data.user_id);
                    setEmail(data.email);

                }
                else{
                    console.log("Response could not be found");

                    
                }
            }catch(error){
                console.log("Fetch could not be completed");
            }
        }

        fetchUserData();


    }, [])

    const fetchEmailChange = async (formData) =>{
        try{
            const response = await fetch('http://127.0.0.1:5011/change_email', {
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
                alert(data.message);
                location.reload();
                console.log("email change successful");
            }else{
                alert(data.message);
                
            }
        }catch(error){
            console.log("Fetch could not be completed");

        }
    }
    const fetchPasswordChange = async (formData) => {
        try{
            const response = await fetch('http://127.0.0.1:5011/change_password', {
                method: 'POST', 
                body: formData, 
                credentials: 'include',
            });
            const data = await response.json();
            if(data.success){
                alert(data.message);
                location.reload();

            }
            else{
                alert(data.message);
            }
        }catch(error){
            console.log("Fetch could not be completed");
        }
    }

    const fetchLogOut = async (formData) => {
        try{
            const response = await fetch('http://127.0.0.1:5011/logout', {
                method: 'POST', 
                body: formData,
                credentials: 'include',
            });

            const data = await response.json();
            if(data.success){
                navigate('/login_page');
                alert(data.message);
            }
            else{
                alert("Something went wrong while logging you out");
                console.log("logout error");
            }
        }catch(error){
            console.log("fetch could not be completed");
        }
    }

    function handleEmailChange(event){
        event.preventDefault;
        const formData = new FormData(event.target);
        fetchEmailChange(formData);
    }
    function handlePasswordChange(event){
        event.preventDefault();
        const formData = new FormData(event.target);
        fetchPasswordChange(formData);
    }
    function handleLogOut(event){
        event.preventDefault();
        const formData = new FormData(event.target);
        fetchLogOut(formData);
    }

    return(
        <>
        <MobileNav/>

        <a href="#" onClick={() => navigate(homepage_path)} >
            <NewLogo size = {70}/>

        </a>
        

        <div className="user-account-info">
        
            <h3>{firstName} {lastName}</h3>
            {is_user && <p>Patient Since {joinDate}</p>}
            
            <p>{email}</p>

        </div>
            

        
        <div className="black-divider"></div>
        <div className="change-email-form">
            <form onSubmit={handleEmailChange}>
                <label for="user-change-email">Change Email Address</label>
                <input type="email" id="user-change-email" name="user-change-email" required/>
                <input type="hidden" id="csrf_token" name="csrf_token" value={csrf_token.csrfToken}/>
                <button type="submit">Change Email</button>
            </form>

        </div>
         <div className="black-divider"></div>
        <div className ="change-password-form">
            <form onSubmit={handlePasswordChange}>
                <h2>Change Password</h2>
                <label for="user-old-password">Previous Password: </label>
                <input type="password" id="user-old-password" name="user-old-password" required/>
                <label for="user-new-password">New Password: </label>
                <input type="password" id="user-new-password" name="user-new-password" required/>
                <label for="user-confirm-password">Confirm New Password: </label>
                <input type="password" id="confirm-new-password" name="confirm-new-password" required/>
                <input type="hidden" id="csrf_token" name="csrf_token" value={csrf_token.csrfToken}/>

                <button type="submit">Change Password</button>
            </form>

        </div>
         <div className="black-divider"></div>
        <div className="logout">
        <form onSubmit={handleLogOut}>
            <input type="hidden" id="logout-userid" name="logout-userid" value={userId}/>
            <button type="submit">LogOut</button>

        </form>
            

        </div>
         <div className="black-divider"></div>
          {showDelete && <DeleteAccount/> }
        
        
        </>
    );

}
export default UserAccountManage