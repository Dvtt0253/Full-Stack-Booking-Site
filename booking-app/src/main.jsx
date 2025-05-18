import React from 'react';
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import './index.css'
import CreateAccount from './CreateAccount.jsx';
import VerifyMessage from './VerifyMessage.jsx';
import Login from './Login.jsx';
import UserHomepage from './UserHomepage.jsx';
import AdminHomepage from './AdminHomepage.jsx';
import App from './App.jsx'

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
    path: '/hompage',
    element: <UserHomepage/>
  },
  {
    path: '/admin_homepage',
    element: <AdminHomepage/>

  }

]);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
