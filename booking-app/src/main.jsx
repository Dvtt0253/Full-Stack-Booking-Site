import React from 'react';
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import './index.css'
import CreateAccount from './CreateAccount.jsx';
import VerifyMessage from './VerifyMessage.jsx';
import Login from './Login.jsx';
import UserHomepage from './UserHomepage.jsx';
import AdminHomepage from './AdminHomepage.jsx';
import BookingPage from './BookingPage.jsx';
import UserAccountManage from './UserAccountManage.jsx';
import ConfirmAccountDelete from './ConfirmAccountDelete.jsx';
import AdminManageAccount from './AdminManageAccount.jsx';
import ResetPassword from './ResetPassword.jsx';
import App from './App.jsx'
import ResetPasswordLink from './ResetPasswordLink.jsx';
import RateLimitResponse from './RateLimitResponse.jsx';
import LoginRateResponse from './LoginRateResponse.jsx';
import Payloads from './Payloads.jsx';
import LoadingPage from './LoadingPage.jsx';
import { CsrfTokenProvider } from './CsrfTokenContext.jsx';
import InitialLoading from './InitialLoading.jsx';



const router = createBrowserRouter([
  {
    path: '/',
    element: <CreateAccount/>,
  },
  {
    path: '/verify_message',
    element: <VerifyMessage/>,
  },
  {
    path: '/login_page',
    element: <Login/>
  },
  {
    path: '/homepage',
    element: <UserHomepage/>
  },
  {
    path: '/admin_homepage',
    element: <AdminHomepage/>

  },
  {
    path: '/booking_page',
    element: <BookingPage/>
  },
  {
    path:'/manage_account',
    element: <UserAccountManage/>
  }, 
  {
    path: '/confirm_deletion',
    element: <ConfirmAccountDelete/>
  },
  {
    path: '/admin_account_management',
    element: <AdminManageAccount/>

  },
  {
    path: '/reset_password',
    element: <ResetPassword/>
  },
  {
    path: '/reset_password_confirmed',
    element: <ResetPasswordLink/>
  }, 
  {
    path: '/429_Response',
    element: <RateLimitResponse/>
  }, 
  {
    path: '/403_Response',
    element: <LoginRateResponse/>
  }, 
  {
    path: '/403_Payloads',
    element: <Payloads/>
  }, 
  {
    path: '/please_wait',
    element: <LoadingPage/>
  },
  {
    path: '/confirm_loading', 
    element: <InitialLoading/>
  }
  

]);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CsrfTokenProvider>
      <RouterProvider router={router}/>

    </CsrfTokenProvider>
    
  </React.StrictMode>,
)
