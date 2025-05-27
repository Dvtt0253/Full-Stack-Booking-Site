import {useNavigate} from 'react-router-dom';
import {useState} from 'react';
import hamburger from './assets/hamburger-menu.png';
import arrow from './assets/back-arrow.png';


function MobileNav() {

    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState(false);

    function showMenu(){

        
        
             setOpenMenu(true);

        
        

       

    }
    function closeMenu(){
       
        setOpenMenu(false);

    }
    return(
        <>
               <div className="hamburger-icon">
                    <img onClick={showMenu} src={hamburger}/>
                </div>
                {openMenu && (
                    <div className="vertical-nav" id="vertical-nav">
                    <button onClick={() => navigate('/homepage')}>Home</button>
                    <button onClick={() => navigate('/booking_page')}>Appointments</button>
                    <button onClick={() => navigate('/manage_account') }>Manage Account</button>
         
                    <button onClick={closeMenu}  className="menu-close-button">
                        <img className="arrow-image" src={arrow}/>
                    </button>
        
                </div>

                )}
                
        </>
    );

}
export default MobileNav