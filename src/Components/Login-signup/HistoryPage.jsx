import "./Login.css";

import { FaLongArrowAltRight } from "react-icons/fa";
import { MdMessage } from "react-icons/md";

import { FaHistory } from "react-icons/fa";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const histories = [
  {
    id: 1,
    text: "How do I feel when I have headache? I really do not know what is going on with me",
  },

  {
    id: 2,
    text: "What are the common symptoms of hypothyroidism and how is it treated?",
  },

  {
    id: 3,
    text: "Can you explain the causes and effects of high blood pressure on the body?",
  },
  {
    id: 4,
    text: "How do I manage stress and anxiety during a pandemic lockdown period?",
  },
  {
    id: 5,
    text: "What are the potential side effects of taking antidepressant medication long term?",
  },
  {
    id: 6,
    text: "Can you describe the symptoms and treatment options for a urinary tract infection?",
  },
  {
    id: 7,
    text: "How does a healthy diet and regular exercise impact mental health and wellbeing?",
  },
  {
    id: 8,
    text: "What are the differences between type 1 and type 2 diabetes mellitus?",
  },
  {
    id: 9,
    text: "Can you provide information on the causes and symptoms of fibromyalgia syndrome?",
  },
  {
    id: 10,
    text: "How do I recognize the warning signs of a heart attack and what to do?",
  },
  {
    id: 11,
    text: "What are the benefits and risks of getting vaccinated against COVID-19?",
  },
  {
    id: 12,
    text: "Can you explain the process of diagnosing and treating a concussion?",
  },
  {
    id: 13,
    text: "How do I cope with chronic pain and improve my quality of life?",
  },
  {
    id: 14,
    text: "What are the common triggers and symptoms of asthma and how is it managed?",
  },
  {
    id: 16,
    text: "Can you describe the symptoms and treatment options for a migraine headache?",
  },
  {
    id: 17,
    text: "How do I prevent and manage osteoporosis and maintain strong bones?",
  },
  {
    id: 18,
    text: "How do I cope with chronic pain and improve my quality of life?",
  },
];

const HistoryPage = () => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const substringLength = screenWidth <= 370 ? 31 : screenWidth <= 450 ? 36 : screenWidth <= 570 ? 55 : screenWidth <= 730 ? 70 : 70;

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className='history-container mobile-history'>
      <h1 className='heading history-page'>History</h1>

      <div className='details-section'>
        <div className='history-details'>
          {histories.map((history) => (
            <div className='each-history'>
              <MdMessage className='message-icon' />

              {history.text.substring(0, substringLength) + "..."}
              {/* <FaLongArrowAltRight className='arrow-icon' /> */}
            </div>
          ))}
        </div>

        <div className='history-footer'>
          <div className='history-section'>
            <FaHistory className='footer-icon' />
            <p>History</p>
          </div>
          <div className='vertical-line'></div>
          <div className='chat-section' onClick={goBack}>
            <IoChatbubbleEllipsesOutline className='footer-icon' />
            <p>Chat</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
