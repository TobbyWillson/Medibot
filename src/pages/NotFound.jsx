import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";
import "../Components/Login-signup/Login.css";

const NotFound = () => {
  return (
    <div className='notfound'>
      <FaExclamationTriangle className='erroricon' />
      <h1>404 Not Found</h1>
      <p>This Page does not exist</p>
      <Link to='/login' className='goback'>
        Go back
      </Link>
    </div>
  );
};

export default NotFound;
