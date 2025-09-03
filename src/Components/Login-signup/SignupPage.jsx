import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api"; // axios wrapper

import userIcon from "../Assets/user-icon.png";
import emailIcon from "../Assets/email-icon.png";
import android from "../Assets/android-robot.png";
import passwordIcon from "../Assets/password-icon.png";
import eyeIcon from "../Assets/eye-icon.png";
import stethoscope from "../Assets/stethoscope.png";

import { FaRobot } from "react-icons/fa";

import "./Login.css";

const SignupPage = () => {
  const [showPass, setShowPass] = useState(true);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const navigate = useNavigate();

  const toggleVisibility = () => setShowPass(!showPass);

  const handleSignup = async () => {
    // Frontend validation
    if (!username || !email || !password || !confirm) {
      alert("All fields are required!");
      return;
    }

    if (password !== confirm) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await api.post("/api/auth/signup", {
        username,
        email,
        password,
        confirmPassword: confirm, // ✅ important
      });

      alert(res.data.message || "Signup successful!");
      navigate("/login"); // redirect after signup
    } catch (err) {
      console.error("Signup error:", err.response?.data || err);
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className='login-sign-page-all'>
      <div className='overall-container'>
        <div className='login-desktop'>
          <div>
            <img src={android} alt='' className='sign-up desktop-robot' />
          </div>

          <div className='note'>
            <p>
              Your Favorite Meical Bot!
              <br />
              <br />
              A chatbot that specializes in analyzing, diagonising and giving medical attentions to users based on inputs. Get in touch today. <br /> <br /> <br />
              Register a new account now to get started!
            </p>
          </div>
        </div>
        <div className='container'>
          <div className='container-bg'>
            <img src={stethoscope} alt='' />
          </div>
          <div className='medibot-head'>
            <div className='robhead'>
              <FaRobot className='robot' />
            </div>
            <div>
              <p className='heading'>MediBot</p>
              <p className='copyright'>&copy; Copyright: Oluwatobi Wilson</p>
            </div>
          </div>
          <div className='header'>
            <div className='header-text'>Register an Account!</div>
            <div className='underline'></div>
            <p> Create a new account to start using MediBot...</p>
          </div>

          <div className='inputs'>
            <div className='input'>
              <img src={userIcon} alt='' />
              <input type='text' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} />
            </div>

            <div className='input'>
              <img src={emailIcon} alt='' />
              <input type='email' placeholder='Email Address' value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className='input'>
              <img src={passwordIcon} alt='' />
              <input type={showPass ? "password" : "text"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
            </div>

            <div className='input'>
              <img src={passwordIcon} alt='' />
              <input type={showPass ? "password" : "text"} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder='Confirm Password' />
              {confirm && <img src={eyeIcon} alt='toggle' className='passEye' onClick={toggleVisibility} />}
            </div>
          </div>

          <div className='submitContainer'>
            <div className='button' onClick={handleSignup}>
              Sign up
            </div>

            <div className='account-checker'>
              <div className='login'>
                <p>Already have an account?</p>
                <Link to='/login'>Login</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
