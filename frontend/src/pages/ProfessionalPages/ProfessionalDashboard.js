import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from './RCMIS-1-01.svg';

import "./ProfessionalStyles/professionalDashboard.css";
import MySchedule from "./MySchedule";
import AppointmentManagement from "./AppointmentManagement/AppointmentManagement";
import AttachPatient from "./AttachPatient"; 
import PatientManagement from "./PatientManagement"; 
import Report from "./Report"; 
import Help from "./Help"; 
import InfoCard from "../../MuiComponents/overviewCard";
//import Predictions from "./Predictions"; // Import Predictions Component

// Icons
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AssessmentSharpIcon from '@mui/icons-material/AssessmentSharp';
import HelpIcon from '@mui/icons-material/Help';
import PredictionsIcon from '@mui/icons-material/BarChart'; // New icon for Predictions

const ProfessionalDashboard = ({ user }) => {
    const navigate = useNavigate();
    const [selectedComponent, setSelectedComponent] = useState("Overview");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const handleNavClick = (component) => {
        setSelectedComponent(component);
    };

    const getWelcomeMessage = () => {
        switch (selectedComponent) {
            case "Overview":
                return `Welcome back, Dr. ${user.name} 👋`;
            case "MySchedule":
                return "Here is your schedule for the upcoming days!";
            case "AttachPatient":
                return "Attach a patient to your care.";
            case "PatientManagement":
                return "Manage your patients efficiently.";
            case "DetachPatient":
                return "Detach patients who completed their treatment.";
            case "Report":
                return "Check your performance and statistics.";
            case "Help":
                return "How can we assist you today?";
            case "Predictions":
                return "View relapse risk predictions.";
            default:
                return `Welcome back, Dr. ${user.name} 👋`;
        }
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="logo">
                    <img src={logo} alt="Logo" />
                    <h2>Professional Dashboard</h2>
                </div>
                <ul className="menu">
                    <li className={`menu-item ${selectedComponent === "Overview" ? "active" : ""}`} onClick={() => handleNavClick("Overview")}>
                        <HomeOutlinedIcon /><span className="menu-title">Home</span>
                    </li>
                    <li className={`menu-item ${selectedComponent === "MySchedule" ? "active" : ""}`} onClick={() => handleNavClick("MySchedule")}>
                        <EditCalendarOutlinedIcon /><span className="menu-title">My Schedule</span>
                    </li>
                    <li className={`menu-item ${selectedComponent === "Appointment" ? "active" : ""}`} onClick={() => handleNavClick("Appointment")}>
                        <EditCalendarOutlinedIcon /><span className="menu-title">Appointment Management</span>
                    </li>
                    <li className={`menu-item ${selectedComponent === "AttachPatient" ? "active" : ""}`} onClick={() => handleNavClick("AttachPatient")}>
                        <PersonAddIcon /> <span className="menu-title">Attach Patient</span>
                    </li>
                    <li className={`menu-item ${selectedComponent === "PatientManagement" ? "active" : ""}`} onClick={() => handleNavClick("PatientManagement")}>
                        <ManageAccountsIcon /> <span className="menu-title">Patient Management</span> 
                    </li>
                    <li className={`menu-item ${selectedComponent === "Report" ? "active" : ""}`} onClick={() => handleNavClick("Report")}>
                        <AssessmentSharpIcon /><span className="menu-title">Reports</span>
                        </li>   
                    {/*
                    
                    <li className={`menu-item ${selectedComponent === "Predictions" ? "active" : ""}`} onClick={() => handleNavClick("Predictions")}>
                        <PredictionsIcon /><span className="menu-title">Predictions</span>
                    </li>*/}
                    <li className={`menu-item ${selectedComponent === "Help" ? "active" : ""}`} onClick={() => handleNavClick("Help")}>
                        <HelpIcon /> <span className="menu-title">Help Center</span>
                    </li>
                    <li className="menu-item" onClick={handleLogout}>
                        <LogoutIcon /><span className="menu-title">Logout</span>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <div className="Navbar">
                    <nav className="bg-white font-sans flex flex-col text-center content-center sm:flex-row sm:text-left sm:justify-between py-2 px-6 sm:items-baseline w-full">
                        <div className="mb-2 sm:mb-0 flex flex-row">
                            <div className="h-10 w-10 self-center mr-2">
                                <img className="h-10 w-10 self-center" src="https://image.emojipng.com/511/267511-small.png" alt="Icon" />
                            </div>
                            <div>
                                <a href="#" className="text-2xl no-underline text-grey-darkest hover:text-blue-dark font-sans font-bold">{`Hello ${user.name} `}</a><br/>
                                <span className="text-xs text-grey-dark">Beautiful New Tagline</span>
                            </div>
                        </div>
                        <div className="sm:mb-0 self-center">
                            <NotificationsIcon onClick={() => handleNavClick('Notifications')} />
                            <span className="px-3">|</span>
                            <LogoutIcon onClick={handleLogout} />
                        </div>
                    </nav>
                </div>

                {/* Render Dashboard based on selected component */}
                <div className="dashboard">
                    {selectedComponent === "Overview" && (
                        <>
                            <div className="cards">
                                <InfoCard title="Total Appointment" total={50} increase={5} percentage={15} conditions="Appointments in the Last 7 days" />
                                <InfoCard title="Patients under care" total={250} increase={7} percentage={15} conditions="Appointments in the Last 7 days" />
                            </div>
                            <div className="statistics">
                                <h2>Patient Statistics</h2>
                                <div className="chart-placeholder">[Chart Placeholder]</div>
                            </div>
                            <div className="calendar">
                                <h2>Upcoming Appointments</h2>
                                <div className="calendar-placeholder">[Calendar Placeholder]</div>
                            </div>
                        </>
                    )}
                    {selectedComponent === "MySchedule" && <MySchedule />}
                    {selectedComponent === "Appointment" && <AppointmentManagement />}
                    {selectedComponent === "AttachPatient" && <AttachPatient />}
                    {selectedComponent === "PatientManagement" && <PatientManagement />}
                    {selectedComponent === "Report" && <Report />}
                    {selectedComponent === "Help" && <Help />}
                    {/* {selectedComponent === "Predictions" && <Predictions />} {/* New Predictions component } */}
                </div>
            </div>
        </div>
    );
};

export default ProfessionalDashboard;
