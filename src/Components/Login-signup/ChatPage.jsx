import "./Login.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import robot from "../Assets/android-robot.png";

import { FaLongArrowAltLeft } from "react-icons/fa";
import { FaEllipsis } from "react-icons/fa6";

import { BsPaperclip } from "react-icons/bs";
import { VscSend } from "react-icons/vsc";

import { useNavigate } from "react-router-dom";

const ChatPage = () => {
  const [insert, setInsert] = useState("");
  const insertMessage = (e) => {
    setInsert(e.target.value);
  };

  const [showHistory, setShowHistory] = useState(false);

  const toggleVisibility = (e) => {
    e.stopPropagation();
    setShowHistory(!showHistory);
  };

  const closeHistory = () => {
    setShowHistory(showHistory);
  };

  useEffect(() => {
    document.body.addEventListener("click", closeHistory);
    return () => {
      document.body.removeEventListener("click", closeHistory);
    };
  }, []);

  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className='chat-interface'>
      <div className='chat-nav'>
        <FaLongArrowAltLeft onClick={goBack} className='backbutton' />
        <p>Chat with Medibot</p>
        <FaEllipsis onClick={toggleVisibility} className='ellipsis' />
        {showHistory && (
          <Link to='/history' className='history'>
            History
          </Link>
        )}
      </div>

      <div className='chatbody'>
        <div className='main-chat'>
          {insert ? (
            <>
              <div className='user-chat'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ad beatae minima corrupti repellendus ! </div>
              <div className='ai-chat'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum recusandae itaque eius at laudantium nam voluptate excepturi dignissimos qui exercitationem ullam numquam aliquam magni, voluptatum optio ea et molestiae unde! In optio dolor commodi totam molestias, asperiores nobis
                debitis aspernatur quia fuga sint voluptatem doloremque cupiditate quam unde! Eos, officiis enim? Obcaecati unde blanditiis officiis aspernatur voluptates distinctio atque dolore?
              </div>
            </>
          ) : (
            <div className='default-message'>
              <img src={robot} width={200} alt='' />
              <p>How may I be of assistance to you today? </p>
            </div>
          )}
        </div>
      </div>

      <div className='text-message'>
        <div className='text-comps'>
          <BsPaperclip className='message-icon' />
          <input type='text' placeholder='Type your message here...' onChange={insertMessage} />
          <VscSend className='message-icon' />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
