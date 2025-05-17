import React from 'react';
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import './index.css'
import CreateAccount from './CreateAccount.jsx';
import VerifyMessage from './VerifyMessage.jsx';
import App from './App.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <CreateAccount/>,
  },
  {
    path: '/verify_message',
    element: <VerifyMessage/>,
  }

]);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
