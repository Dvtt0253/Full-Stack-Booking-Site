import NewLogo from './NewLogo.jsx';

function LoginRateResponse(){
    return(
        <>

            <NewLogo/>
        <div className="login-rate-div">
            <h1>403</h1>
            <p>Too Many Login Attempts.</p>
            <p>If you have forgotten your password, please reset your password <a href="#">here</a> to avoid continuous lockouts that will eventually lead to a permanent disable of access to the application. </p>
            <p>You will be able to reattempt logging in within 30 minutes.</p>
            

        </div>
            
        </>

    );

}
export default LoginRateResponse