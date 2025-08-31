import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api"; // axios wrapper

import userIcon from "../Assets/user-icon.png";
import emailIcon from "../Assets/email-icon.png";
import passwordIcon from "../Assets/password-icon.png";
import eyeIcon from "../Assets/eye-icon.png";
import stethoscope from "../Assets/stethoscope.png";

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
    <div className='container'>
      <div className='container-bg'>
        <img src={stethoscope} alt='' />
      </div>

      <div className='header'>
        <div className='header-text'>Sign up</div>
        <div className='underline'></div>
      </div>

      <div className='inputs'>
        <div className='input'>
          <img src={userIcon} alt='' />
          <input type='text' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
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
  );
};

export default SignupPage;
