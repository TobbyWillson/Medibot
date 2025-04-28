import "./Login.css";
import { Link } from "react-router-dom";
import android from "../Assets/android-robot.png";

const HomePage = () => {
  return (
    <div>
      <div className='home-container'>
        <h1>
          Meet Your New <span> AI Companion </span>
        </h1>
        <img src={android} alt='' className='robot' />
        <p className='version'>v1.0</p>
        <p className='welcome-message'>It is a pleasure to meet you! How can I assist you today?</p>
        <Link to='/login' className='get-started'>
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
