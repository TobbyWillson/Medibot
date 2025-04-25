import { useState } from "react";
import { Link } from "react-router-dom";

import emailIcon from "../Assets/email-icon.png";
import passwordIcon from "../Assets/password-icon.png";
import eyeIcon from "../Assets/eye-icon.png";

import stethoscope from "../Assets/stethoscope.png";

import "./Login.css";

const LoginPage = () => {
  const [showPass, setShowPass] = useState(true);
  const [insert, setInsert] = useState("");

  const insertPass = (e) => {
    setInsert(e.target.value);
  };

  const toggleVisibility = () => {
    setShowPass(!showPass);
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
          <input type='email' placeholder='Email Address' required />
        </div>

        <div className='input'>
          <img src={passwordIcon} alt='' />
          <input type={showPass ? "password" : "text"} onChange={insertPass} name='login-pass' placeholder='Password' />
          {insert ? <img src={eyeIcon} alt='' className='passEye' onClick={toggleVisibility} /> : ""}
        </div>
      </div>

      <div className='remember'>
        {insert ? (
          <>
            <input type='checkbox' name='remember' />
            <p>Remember this device!</p>{" "}
          </>
        ) : (
          ""
        )}
      </div>

      <div className='submitContainer'>
        {insert ? <div className='button'>Log in</div> : ""}
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
