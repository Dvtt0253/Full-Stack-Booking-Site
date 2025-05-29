import { useCsrfToken } from "./CsrfTokenContext.jsx";
import {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import NewLogo from './NewLogo.jsx';

function postWarmup(){
    const csrf_token = useCsrfToken();
    const [ready, setReady] = useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
        const fetchWarmup = setInterval( async () =>{
        try{
            const response = await fetch('http://127.0.0.1:5011/check_post_request', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': csrf_token.csrfToken,

                },
            });
            const data = await response.json();
            if(data.status === 200){
                setReady(true);
                console.log("status is 200");
                clearInterval(fetchWarmup);
            }
            else{
                setReady(false);
                location.reload();
            }
        }catch(error){
            setReady(false);
            console.log("fetch failed");
        }

        }, 1000)
        return () => clearInterval(fetchWarmup);
            
    }, [])

    if(!ready){
        return(
            <>
            <NewLogo/>
            <div  className="loading-divs">
                <p>Please Wait ...</p>

            </div>
            
                
            </>
            
                
            
        );
    }
    else{
        navigate('/homepage');
    }




    

}
export default postWarmup
