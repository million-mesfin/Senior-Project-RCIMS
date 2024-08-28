import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Dashboard from "./pages/Dashboard/dashboard";


function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Login />}></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/signup" element={<Signup />}></Route>
                <Route path="/dashboard" element={<Dashboard />}></Route> 
            </Routes>
        </div>
    );
}

export default App;
