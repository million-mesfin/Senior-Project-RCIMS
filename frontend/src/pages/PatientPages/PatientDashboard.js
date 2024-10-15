import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Appointments from "./Appointment/Appointments";
import MedicalHistory from "./MedicalHistory";
import Notifications from "./Notifications";
import Messaging from "./Messaging";
import GeneralReport from "./GeneralReport";
import Feedback from "./Feedback";
import Help from "../ProfessionalPages/Help";
import "./PatientPagesStyles/PatientDashboard.css";
import logo from "./RCMIS-1-01.svg";

import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SummarizeIcon from '@mui/icons-material/Summarize';
import CommentIcon from '@mui/icons-material/Comment';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddDisabledIcon from '@mui/icons-material/PersonAddDisabled';

const PatientDashboard = ({ patient, user }) => {
    const navigate = useNavigate();
    const [selectedComponent, setSelectedComponent] = useState("Appointments");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("patient");
        navigate("/login");
    };

    const handleNavClick = (component) => {
        setSelectedComponent(component);
    };


    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="logo">
                    <img src={logo} alt="HealthCare Logo" />
                    <h2 className="text-sm">Patient Dashboard</h2>
                </div>
                <ul className="menu">
                    <li className={`menu-item ${selectedComponent === "Appointments" ? "active" : ""}`} onClick={() => handleNavClick("Appointments")}>
                        <CalendarMonthIcon /><span className="menu-title">Appointments</span>

                    </li>
                    <li className={`menu-item ${selectedComponent === "MedicalHistory" ? "active" : ""}`} onClick={() => handleNavClick("MedicalHistory")}>
                        <AssessmentIcon /> <span className="menu-title">Medical History</span>
                    </li>
                    <li className={`menu-item ${selectedComponent === "Notifications" ? "active" : ""}`} onClick={() => handleNavClick("Notifications")}>
                        <NotificationsIcon /> <span className="menu-title">Notifications</span>
                    </li>
                    <li className={`menu-item ${selectedComponent === "Messaging" ? "active" : ""}`} onClick={() => handleNavClick("Messaging")}>
                        <ChatBubbleIcon /> <span className="menu-title">Messaging</span>
                    </li>
                    <li className={`menu-item ${selectedComponent === "GeneralReport" ? "active" : ""}`} onClick={() => handleNavClick("GeneralReport")}>
                        <SummarizeIcon /> <span className="menu-title">General Report</span>
                    </li>
                    <li className={`menu-item ${selectedComponent === "Feedback" ? "active" : ""}`} onClick={() => handleNavClick("Feedback")}>
                        <CommentIcon /> <span className="menu-title">Feedback</span>
                    </li>
                    <li className={`menu-item ${selectedComponent === "Help" ? "active" : ""}`} onClick={() => handleNavClick("Help")}>
                        <SummarizeIcon /> <span className="menu-title">Help</span>
                    </li>
                    <li className="menu-item" onClick={handleLogout}>
                        <LogoutIcon /> <span className="menu-title">Logout</span>
                    </li>
                </ul>


            </div>

            {/* Main Content */}
           <div className="main">
           {/* <!-- component --> */}
            <div className="Navbar">
            <nav class="bg-white font-sans flex flex-col text-center content-center sm:flex-row sm:text-left sm:justify-between py-2 px-6   sm:items-baseline w-full">

                    <div class="mb-2 sm:mb-0 flex flex-row
                    ">
                    <div class="h-10 w-10 self-center mr-2">
                        <img class="h-10 w-10 self-center" src="https://image.emojipng.com/511/267511-small.png" />
                    </div>
                    <div>
                        <a href="#" class="text-2xl no-underline text-grey-darkest hover:text-blue-dark font-sans font-bold">{`Hello ${user.name} `}</a><br/>
                        <span class="text-xs text-grey-dark">Beautiful New Tagline</span>
                    </div>
                    </div>

                    <div class="sm:mb-0 self-center">
                        <NotificationsIcon onClick = {()=> handleNavClick('Notifications')}/>
                        <span className="px-3">|</span>
                        <LogoutIcon onClick={handleLogout}/>

                    </div>
                    </nav>
            </div>

            <div className="main-content">
                <div className="dashboard">
                    {selectedComponent === "Appointments" && <Appointments patient={patient} />}
                    {selectedComponent === "MedicalHistory" && <MedicalHistory patient={patient} />}
                    {selectedComponent === "Notifications" && <Notifications patient={patient} />}
                    {selectedComponent === "Messaging" && <Messaging patient={patient} />}
                    {selectedComponent === "GeneralReport" && <GeneralReport patient={patient} />}
                    {selectedComponent === "Feedback" && <Feedback patient={patient} />}
                    {selectedComponent === "Help" && <Help patient={patient} />}
                </div>
            </div>
         </div> 
    </div>
    );
};

export default PatientDashboard;
