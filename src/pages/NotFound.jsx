import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";
import "../Components/Login-signup/Login.css";

import { useNavigate } from "react-router-dom";
const NotFound = () => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className='notfound'>
      <FaExclamationTriangle className='erroricon' />
      <h1>404 Not Found</h1>
      <p>This page does not exist yet</p>
      <p onClick={goBack} className='goback'>
        Go back
      </p>
    </div>
  );
};

export default NotFound;
