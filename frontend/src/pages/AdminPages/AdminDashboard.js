import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styling/AdminPageStyles/adminDashboard.css";
import Appointments from "./Appointment/Appointments";
import PatientManagement from "./PatientManagement/PatientManagement";
import ProfessionalManagement from "./ProfessionalManagement/ProfessionalManagement";
import Report from "./Report";
import Contact from "./Contact";
import Help from "./Help";
import logo from "../../pages/PatientPages/RCMIS-1-01.svg";


// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import SummarizeIcon from '@mui/icons-material/Summarize';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import Feedback from "../PatientPages/Feedback";
import PatientStat from "../../MuiComponents/GraphComponent";
import PatientOverviewCard from "../../MuiComponents/PatientsOverviewCard";
import InfoCard from "../../MuiComponents/overviewCard";
import Calendar from "../../MuiComponents/calander";

const AdminDashboard = ({ user }) => {
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

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="logo">
                    <img src={logo} alt="WeCare Logo" />
                    <h2>Admin Dashboard</h2>
                </div>
                <ul className="menu">
                    <li className={`menu-item ${selectedComponent === "Overview" ? "active" : ""}`} onClick={() => handleNavClick("Overview")}>
                        <DashboardIcon /><span className="menu-title">Home</span>
                    </li>
                    <li className={`menu-item ${selectedComponent === "Appointments" ? "active" : ""}`} onClick={() => handleNavClick("Appointments")}>
                        <CalendarMonthIcon /> <span className="menu-title">Appointments</span>
                    </li>
                    <li className={`menu-item ${selectedComponent === "PatientManagement" ? "active" : ""}`} onClick={() => handleNavClick("PatientManagement")}>
                        <PersonIcon /><span className="menu-title">Patient Management</span>
                    </li>
                    <li className={`menu-item ${selectedComponent === "ProfessionalManagement" ? "active" : ""}`} onClick={() => handleNavClick("ProfessionalManagement")}>
                        <PeopleIcon /> <span className="menu-title">Professionals</span>
                    </li>
                    <li className={`menu-item ${selectedComponent === "Report" ? "active" : ""}`} onClick={() => handleNavClick("Report")}>
                        <SummarizeIcon /> <span className="menu-title">Report</span>
                    </li>
                    <li className={`menu-item ${selectedComponent === "Help" ? "active" : ""}`} onClick={() => handleNavClick("Help")}>
                        <LiveHelpIcon /> <span className="menu-title">Help & Center</span>
                    </li>
                    <li className="menu-item" onClick={handleLogout}>
                        <LogoutIcon /> <span className="menu-title">Logout</span>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="main-content">

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
                        <NotificationsActiveIcon onClick = {()=> handleNavClick('Notifications')}/>
                        <span className="px-3">|</span>
                        <LogoutIcon onClick={handleLogout}/>

                    </div>
                    </nav>
            </div>
                {/* Render Dashboard based on selected component */}
                <div className="dashboard">
                    {selectedComponent === "Overview" && (
                        <>
               <div style={{ display: "flex", gap: "16px" }}>
                            <InfoCard
                                title="Men Patients "
                                total={250}
                                increase={19}
                                percentage={15}
                                conditions="asthma, common cold, immunizations"
                            />
                            <InfoCard
                                title="Women Patients"
                                total={400}
                                increase={25}
                                percentage={20}
                                conditions="diabetes, hypertension, obesity"
                            />
                            </div>
                            <div className="cards">
                                {/* <div className="card">
                                    <h2>Overall Visitors</h2>
                                    <p>10,525 <span className="increase">+15.2%</span></p>
                                    <p>Data obtained for the last 7 days</p>
                                </div>
                                <div className="card">
                                    <h2>Total Patients</h2>
                                    <p>5,715 <span className="increase">+10.4%</span></p>
                                    <p>Increase in data by 500 inpatients in the last 7 days</p>
                                </div>
                                <div className="card">
                                    <h2>Discharged</h2>
                                    <p>523 <span className="increase">+165</span></p>
                                    <p>Discharged data obtained for the last 7 days</p>
                                </div> */}
                                 <InfoCard
                                    title="Overall Visitors"
                                    total={10400}
                                    increase={25}
                                    percentage={60}
                                    conditions="Data obtained for the last 7 days"
                                />
                                <InfoCard
                                    title="Total Patients"
                                    total={5200}
                                    increase={25}
                                    percentage={20}
                                    conditions="Data obtained for the last 7 days"
                                />
                                 <InfoCard
                                    title="Discharged"
                                    total={503}
                                    increase={125}
                                    percentage={10}
                                    conditions="Data obtained for the last 7 days"
                                />
                            </div>

                            {/* Statistics and Calendar */}
                         <div className="StatAndCal">
                           <div className="statistics">
                                <h2>Patient Statistics</h2>
                                <PatientStat />
                            </div>
                            {/* <div className="calendar">
                                <h2>Calendar</h2>
                                <div className="calendar-placeholder">[Calendar Placeholder]</div>
                            </div>  */}
                            <Calendar />
                         </div>

                        </>
                    )}
                    {selectedComponent === "Appointments" && <Appointments />}
                    {selectedComponent === "PatientManagement" && <PatientManagement />}
                    {selectedComponent === "ProfessionalManagement" && <ProfessionalManagement />}
                    {selectedComponent === "Report" && <Report />}
                    {selectedComponent === "Contact" && <Contact />}
                    {selectedComponent === "Help" && <Help />}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
