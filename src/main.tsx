import React from 'react'
import ReactDOM from 'react-dom/client'
import LoginPage from './Login.tsx'
import './reset.css'
import RegisterPage from './Register.tsx'
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import ChatPage from './Chat.tsx'
import GroupRegister from './GroupRegister.tsx'
import AddMembersToGroup from './GroupAddMembers.tsx'

export const API_URL = "https://infratrack-api.hisrael.dev"

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
  {
    path: '/group-register',
    element: <GroupRegister/>,
  },
  {
    path: '/add-user/:id/:name',
    element: <AddMembersToGroup/>
  }
]);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
)
