import { createContext, useContext } from "react";
import {useState, useEffect} from 'react';

const CsrfTokenContext = createContext();

export function CsrfTokenProvider({children}){
    const [csrfToken, setCsrfToken] = useState("");
    
    

    useEffect(()=>{
        const fetchCsrf = async () => {
            try{
                const response = await fetch('http://127.0.0.1:5011/get_user_csrf', {
                    credentials: 'include',
                });
                const data = await response.json();
                if(data.success){
                    setCsrfToken(data.session_csrf);
                }
                else{
                    console.log("Response not found");
                }
            }catch(error){
                console.log("Fetch could not be completed");
            }
        }
        fetchCsrf()
    }, [])

   

    return(
        <CsrfTokenContext.Provider value={{csrfToken}}>
            {children}
        </CsrfTokenContext.Provider>
    );

    
}
export function useCsrfToken(){
    return useContext(CsrfTokenContext);
}