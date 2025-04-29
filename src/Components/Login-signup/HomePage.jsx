import "./Login.css";
import { Link } from "react-router-dom";
import android from "../Assets/android-robot.png";
import { FaStethoscope } from "react-icons/fa";

const HomePage = () => {
  return (
    <div>
      <div className='home-container'>
        <h1>Meet Your New AI Companion</h1>
        <img src={android} alt='' className='robot' />
        <p className='version'>v1.0</p>
        <p className='welcome-message'>It is a pleasure to meet you! How can I assist you today?</p>
        <Link to='/login' className='get-started'>
          Get Started
        </Link>
      </div>

      {/* Desktop Version */}

      <div className='desktop'>
        <div className='desknav'>
          <div className='deskleft'>
            <FaStethoscope className='stethoscope' />
            <h1>Medibot</h1>
          </div>

          <div className='deskright'>
            <Link to='/login'>Login</Link>
            <Link to='/signup'>Signup</Link>
          </div>
        </div>
        <div className='underline'></div>
      </div>
    </div>
  );
};

export default HomePage;
