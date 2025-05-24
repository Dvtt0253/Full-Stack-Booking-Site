import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

function UserAccountManage(){
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [joinDate, setJoinDate] = useState();
    const [email, setEmail] = useState();
    const[userId, setUserId] = useState();
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
            if(data.success){
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
        <div className="user-account-info">
            <h3>{firstName} {lastName}</h3>
            <p>Patient since {joinDate}</p>
            <p>{email}</p>

        </div>
        <div className="black-divider"></div>
        <div className="change-email-form">
            <form onSubmit={handleEmailChange}>
                <label for="user-change-email">Change your Email Address</label>
                <input type="email" id="user-change-email" name="user-change-email" required/>
                <button type="submit">Change Email</button>
            </form>

        </div>
         <div className="black-divider"></div>
        <div className ="change-password-form">
            <form onSubmit={handlePasswordChange}>
                <h2>Change Your Password</h2>
                <label for="user-old-password">Previous Password: </label>
                <input type="password" id="user-old-password" name="user-old-password" required/>
                <label for="user-new-password">New Password: </label>
                <input type="password" id="user-new-password" name="user-new-password" required/>
                <label for="user-confirm-password">Confirm New Password: </label>
                <input type="password" id="confirm-new-password" name="confirm-new-password" required/>
                <button type="submit">Change Password</button>
            </form>

        </div>
         <div className="black-divider"></div>
        <div className="logout">
        <form onSubmit={handleLogOut}>
            <input type="hidden" id="logout-userid" name="logout-userid" value={userId}/>
            <button type="submit">Log Out</button>

        </form>
            

        </div>
         <div className="black-divider"></div>
        <div className="delete-account">
            <button onClick={() => navigate('/confirm_deletion')}> Delete Your Account</button>

            

        </div>
        </>
    );

}
export default UserAccountManage