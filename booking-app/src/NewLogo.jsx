import Logo from './assets/Blue-Logo.png';

function NewLogo({size = 100}){

    return(
            <img style={{width: size}} className="Blue-Logo" alt="Bluetree-log" src={Logo}/>
    
        );
    

}

export default NewLogo