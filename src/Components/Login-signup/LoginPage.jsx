import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";
// 👈 using axios wrapper

import emailIcon from "../Assets/email-icon.png";
import passwordIcon from "../Assets/password-icon.png";
import eyeIcon from "../Assets/eye-icon.png";
import stethoscope from "../Assets/stethoscope.png";

import "./Login.css";

const LoginPage = () => {
  const [showPass, setShowPass] = useState(true);
  const [insert, setInsert] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const insertPass = (e) => {
    setPassword(e.target.value);
    setInsert(e.target.value); // keeps your existing logic for eye icon
  };

  const toggleVisibility = () => {
    setShowPass(!showPass);
  };

  const handleLogin = async () => {
    try {
      const res = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token); // store JWT
      alert("Login successful!");
      navigate("/chat"); // redirect to chat after login
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className='container'>
      <div className='container-bg'>
        <img src={stethoscope} alt='' />
      </div>

      <div className='header'>
        <div className='header-text'>Log in</div>
        <div className='underline'></div>
      </div>

      <div className='inputs'>
        <div className='input'>
          <img src={emailIcon} alt='' />
          <input type='email' placeholder='Email Address' value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className='input'>
          <img src={passwordIcon} alt='' />
          <input type={showPass ? "password" : "text"} onChange={insertPass} value={password} placeholder='Password' />
          {insert ? <img src={eyeIcon} alt='' className='passEye' onClick={toggleVisibility} /> : null}
        </div>
      </div>

      <div className='remember'>
        {insert ? (
          <>
            <input type='checkbox' name='remember' />
            <p>Remember this device!</p>
          </>
        ) : null}
      </div>

      <div className='submitContainer'>
        {insert ? (
          <div className='button' onClick={handleLogin}>
            Log in
          </div>
        ) : null}
        <div className='account-checker'>
          <div className='forgot'>
            <p>Forgot password?</p>
            <Link to='/forgot-password'>Click Here</Link>
          </div>

          <div className='signup'>
            <p>Do not have an account yet?</p>
            <Link to='/signup'>Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
