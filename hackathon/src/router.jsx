import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import Signup from "./components/Signup.jsx";
import Signin from "./components/Signin.jsx";

export const router = createBrowserRouter( [
    { path: "/", element: <App /> },
    { path: "/signup", element: <Signup/> },
    { path: "/signin", element: <Signin/> },
])