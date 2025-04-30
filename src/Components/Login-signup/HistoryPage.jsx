import "./Login.css";

import { FaLongArrowAltRight } from "react-icons/fa";
import { MdMessage } from "react-icons/md";

import { FaHistory } from "react-icons/fa";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

import { useNavigate } from "react-router-dom";

const histories = [
  {
    id: 1,
    text: "How do I feel when I have headache? I really do not know what is going on with me",
  },

  {
    id: 2,
    text: "How do I feel when I have headache? I really do not know what is going on with me",
  },

  {
    id: 3,
    text: "Yes",
  },
];

const HistoryPage = () => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className='history-container'>
      <h1 className='heading'>History</h1>

      <div className='details-section'>
        <div className='history-details'>
          {histories.map((history) => (
            <div className='each-history'>
              <MdMessage className='message-icon' />

              {history.text.substring(0, 25) + "..."}
              <FaLongArrowAltRight className='arrow-icon' />
            </div>
          ))}
        </div>

        <div className='history-footer'>
          <div className='history-section'>
            <FaHistory className='footer-icon' />
            History
          </div>

          <div className='chat-section' onClick={goBack}>
            <IoChatbubbleEllipsesOutline className='footer-icon' />
            Chat
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
