import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import './index.css'
import App from './App.jsx'
import Signup from "./pages/auth/Signup.jsx";
import Login from "./pages/auth/Login.jsx";
import AddCourse from "./pages/AddCourse/AddCourse.jsx";

const router = createBrowserRouter([
    {path: "/", element: <App/>},
    {path: "/signup", element: <Signup/>},
    {path: "/login", element: <Login/>},
    {path: "/add-course", element: <AddCourse/>},
  ])
;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
