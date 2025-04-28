import "./Login.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import robot from "../Assets/android-robot.png";

import { FaArrowLeft } from "react-icons/fa";
import { FaEllipsis } from "react-icons/fa6";
import { FaPlusCircle } from "react-icons/fa";
import { FaArrowRightToBracket } from "react-icons/fa6";

const ChatPage = () => {
  const [insert, setInsert] = useState("");

  const insertMessage = (e) => {
    setInsert(e.target.value);
  };

  return (
    <div className='chat-interface'>
      <div className='chat-nav'>
        <FaArrowLeft />
        <p>Chat with Medibot</p>
        <FaEllipsis />
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
              <p>How may I be of assistance today? </p>
            </div>
          )}
        </div>
      </div>

      <div className='text-message'>
        <div className='text-comps'>
          <FaPlusCircle />
          <input type='text' placeholder='Type your message...' onChange={insertMessage} />
          <FaArrowRightToBracket />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
