import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import Signup from "./components/Signup.jsx";
import Signin from "./components/Signin.jsx";
import Mainpage from "./components/Mainpage.jsx";
import EnrolledClass from "./components/Enrolledclass.jsx";

export const router = createBrowserRouter( [
    { path: "/", element: <App /> },
    // { path: "/signup", element: <Signup/> },
    { path: "/signin", element: <Signin/> },
    { path: "/mainpage/:classname/:date", element: <Mainpage/> },
    { path: "/classlists", element: <EnrolledClass/> },
])