import React from 'react'
import ReactDOM from 'react-dom/client'
import LoginPage from './Login.tsx'
import './reset.css'
import RegisterPage from './Register.tsx'
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import ChatPage from './Chat.tsx'

const router = createBrowserRouter([
  {
    path: "*",
    element: <Navigate to='/' />,
  },
  {
    path: '/',
    element: <LoginPage/>,
  },
  {
    path: '/register',
    element: <RegisterPage/>,
  },
  {
    path: '/chat',
    element: <ChatPage/>,
  },
]);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
)
