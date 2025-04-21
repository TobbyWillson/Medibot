import userIcon from "../Assets/user-icon.png";
import emailIcon from "../Assets/email-icon.png";
import passwordIcon from "../Assets/password-icon.png";
import eyeIcon from "../Assets/eye-icon.png";

import stethoscope from "../Assets/stethoscope.png";

import "./Login.css";

import { useState } from "react";

const LoginSignup = () => {
  const [showPass, setShowPass] = useState(false);
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
          <div className='header-text'>{action}</div>
          <div className='underline'></div>
        </div>

        <div className='inputs'>
          {action === "Login" ? (
            <></>
          ) : (
            <div className='input'>
              <img src={userIcon} alt='' />
              <input type='text' placeholder='Username' />
            </div>
          )}

          <div className='input'>
            <img src={emailIcon} alt='' />
            <input type='email' placeholder='Email Address' />
          </div>

          {action === "Sign up" ? (
            <div className='input'>
              <img src={passwordIcon} alt='' />
              <input type={showPass ? "password" : "text"} placeholder='Password' />
            </div>
          ) : (
            <div className='input'>
              <img src={passwordIcon} alt='' />
              <input type={showPass ? "password" : "text"} placeholder='Password' />
              <img src={eyeIcon} className='passshow' alt='' onClick={toggleVisibility} />
            </div>
          )}
          {action === "Login" ? (
            <></>
          ) : (
            <div className='input'>
              <img src={passwordIcon} alt='' />
              <input type={showPass ? "password" : "text"} placeholder='Confirm Password' />
              <img src={eyeIcon} alt='' className='passshow' onClick={toggleVisibility} />
            </div>
          )}
        </div>
        {action === "Sign up" ? (
          <></>
        ) : (
          <div className='remember'>
            <input type='checkbox' name='remember' />
            <p>Remember this device!</p>
          </div>
        )}

        <div className='submitContainer'>
          <div className='button'>{action}</div>
          {action === "Login" ? (
            <div className='login'>
              <div className='forgot'>
                Forgot password? <span>Click here</span>
              </div>
              Do not have an account yet?{" "}
              <span
                onClick={() => {
                  setAction("Sign up");
                }}
              >
                Sign up
              </span>
            </div>
          ) : (
            <div className='login'>
              Already have an account?{" "}
              <span
                onClick={() => {
                  setAction("Login");
                }}
              >
                Login
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
