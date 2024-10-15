import ProCard from './components/card';
import CareTeam from './components/careTeam';
import "./PatientPagesStyles/Messaging.css";

const Messaging = () =>{
    return (
        <>

        <h2>Professionals</h2>
          <div className="cards">
            {/* <div className="card">
                <h2>Dr. Abebe Kebede</h2>
                <img className = "docImg" src={Doc} alt="HealthCare Logo" />
                <p>Psychatrist</p>
            </div>
            <div className="card">
                <h2>Dr. Abebe Kebede</h2>
                <img className = "docImg" src={Doc} alt="HealthCare Logo" />
                <p>Psychatrist</p>
            </div>
            <div className="card">
                <h2>Dr. Abebe Kebede</h2>
                <img className = "docImg" src={Doc} alt="HealthCare Logo" />
                <p>Psychatrist</p>

            </div> */}
            <ProCard />
            <ProCard />
            <ProCard />
            <ProCard />

         </div>
         <CareTeam />

      </>
    );
}

export default Messaging