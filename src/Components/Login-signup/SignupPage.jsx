import userIcon from "../Assets/user-icon.png";
import emailIcon from "../Assets/email-icon.png";
import passwordIcon from "../Assets/password-icon.png";
import eyeIcon from "../Assets/eye-icon.png";

import stethoscope from "../Assets/stethoscope.png";

import "./Login.css";
import { Link } from "react-router-dom";

import { useState } from "react";

const SignupPage = () => {
  const [showPass, setShowPass] = useState(true);
  const [insert, setInsert] = useState("");

  const insertPass = (e) => {
    setInsert(e.target.value);
  };

  const toggleVisibility = () => {
    setShowPass(!showPass);
  };

  const [action, setAction] = useState("Sign up");

  return (
    <div>
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
            <input type='text' placeholder='Username' />
          </div>

          <div className='input'>
            <img src={emailIcon} alt='' />
            <input type='email' placeholder='Email Address' required />
          </div>

          <div className='input'>
            <img src={passwordIcon} alt='' />
            <input type={showPass ? "password" : "text"} name='signup-pass1' placeholder='Password' />
          </div>

          <div className='input'>
            <img src={passwordIcon} alt='' />
            <input type={showPass ? "password" : "text"} onChange={insertPass} name='signup-pass2' placeholder='Confirm Password' />
            {insert ? <img src={eyeIcon} alt='' className='passEye' onClick={toggleVisibility} /> : ""}
          </div>
        </div>

        <div className='submitContainer'>
          {insert ? <div className='button'>{action}</div> : ""}
          <div className='account-checker'>
            <div className='login'>
              <p>Already have an account?</p>
              <Link to='/login'>Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
