import userIcon from "../Assets/user-icon.png";
import emailIcon from "../Assets/email-icon.png";
import passwordIcon from "../Assets/password-icon.png";
import eyeIcon from "../Assets/eye-icon.png";

import stethoscope from "../Assets/stethoscope.png";

import "./Login.css";

import { useState } from "react";

const LoginPage = () => {
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
            <input type='email' placeholder='Email Address' required />
          </div>
          {action === "Sign up" ? (
            <div className='input'>
              <img src={passwordIcon} alt='' />
              <input type={showPass ? "password" : "text"} name='signup-pass1' placeholder='Password' />
            </div>
          ) : (
            <div className='input'>
              <img src={passwordIcon} alt='' />
              <input type={showPass ? "password" : "text"} onChange={insertPass} name='login-pass' placeholder='Password' />
              {insert ? <img src={eyeIcon} alt='' className='passEye' onClick={toggleVisibility} /> : ""}
            </div>
          )}
          {action === "Login" ? (
            <></>
          ) : (
            <div className='input'>
              <img src={passwordIcon} alt='' />
              <input type={showPass ? "password" : "text"} onChange={insertPass} name='signup-pass2' placeholder='Confirm Password' />
              {insert ? <img src={eyeIcon} alt='' className='passEye' onClick={toggleVisibility} /> : ""}
            </div>
          )}
        </div>

        {action === "Sign up" ? (
          <></>
        ) : (
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
        )}

        <div className='submitContainer'>
          {insert ? <div className='button'>{action}</div> : ""}
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

export default LoginPage;
