import blueTreeLogo from './assets/bluetree-white.png';

function NavLogo({size = '3.37vw'}){

return(

     <img style={{width: size}} className="nav-logo" alt="bluetree-log" src={blueTreeLogo}/>
);

}
export default NavLogo