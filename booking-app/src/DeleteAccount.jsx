function DeleteAccount(){
    return(
         <div className="delete-account">
            <button onClick={() => navigate('/confirm_deletion')}> Delete Your Account</button>

            

        </div>
    );
}

export default DeleteAccount