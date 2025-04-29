import "./Login.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import robot from "../Assets/android-robot.png";

import { FaArrowLeft } from "react-icons/fa";
import { FaEllipsis } from "react-icons/fa6";
import { FaPlusCircle } from "react-icons/fa";
import { FaPaperclip } from "react-icons/fa6";
import { FaRegPaperPlane } from "react-icons/fa6";
import { FaPaperPlane } from "react-icons/fa";

const ChatPage = () => {
  const [insert, setInsert] = useState("");

  const [showHistory, setShowHistory] = useState(false);

  const toggleVisibility = () => {
    setShowHistory(!showHistory);
  };

  const insertMessage = (e) => {
    setInsert(e.target.value);
  };

  return (
    <div className='chat-interface'>
      <div className='chat-nav'>
        <FaArrowLeft />
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
          <FaPaperclip />
          <input type='text' placeholder='Type your message...' onChange={insertMessage} />
          <FaPaperPlane />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
