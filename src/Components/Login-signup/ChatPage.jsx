import "./Login.css";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import robot from "../Assets/android-robot.png";

import { FaLongArrowAltLeft } from "react-icons/fa";
import { FaEllipsis } from "react-icons/fa6";

import { BsPaperclip } from "react-icons/bs";
import { VscSend } from "react-icons/vsc";
import { ImSearch } from "react-icons/im";
import { FaTimes } from "react-icons/fa";

import { MdMessage } from "react-icons/md";

import { useNavigate } from "react-router-dom";

const ChatPage = () => {
  const [insert, setInsert] = useState("");
  const insertMessage = (e) => {
    setInsert(e.target.value);
  };

  // --------------- History button Visibility

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

  //  -------------------- Search Bar Visibility

  const [showSearchBar, setShowSearchBar] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const searchBarRef = useRef(null);

  const toggleSearchBar = (e) => {
    e.stopPropagation();
    setShowSearchBar(!showSearchBar);
    handleCloseSearch();
  };

  const handleCloseSearch = () => {
    setSearchQuery("");
  };

  const closeSearchBar = (e) => {
    if (searchBarRef.current && !searchBarRef.current.contains(e.target)) {
      setShowSearchBar(false);
      handleCloseSearch();
    }
  };

  useEffect(() => {
    document.body.addEventListener("click", closeSearchBar);
    return () => {
      document.body.removeEventListener("click", closeSearchBar);
    };
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };
  const highlightText = (text) => {
    if (!searchQuery) return text;
    const regex = new RegExp(searchQuery, "gi");
    return text.replace(regex, (match) => `<span class='highlight'>${match}</span>`);
  };

  // ----------------------------------

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const substringLength = screenWidth <= 370 ? 31 : screenWidth <= 450 ? 36 : screenWidth <= 570 ? 55 : screenWidth <= 730 ? 70 : 70;

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const messages = [
    { id: 1, text: "Hello, how are you?", sender: "user" },
    { id: 2, text: "I am good, thanks! How can I assist you today?", sender: "ai" },
    { id: 3, text: "I need help with a coding issue.", sender: "user" },
    { id: 4, text: "What seems to be the issue? Please provide more details.", sender: "ai" },
    { id: 5, text: "I am getting an error when trying to compile my code.", sender: "user" },
    { id: 6, text: "Can you please share the error message and the code snippet that is causing the issue?", sender: "ai" },
  ];

  return (
    <div className='chat-interface'>
      {/* Desktop Version */}
      <div className='history-container'>
        <h1 className='heading'>History</h1>

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
        </div>
      </div>

      <div className='overall-chat'>
        <div className='chat-nav'>
          <div>
            <FaLongArrowAltLeft onClick={goBack} className='backbutton' />
          </div>
          <div>
            <p>Chat with Medibot</p>
          </div>
          <div>
            <FaEllipsis onClick={toggleVisibility} className='ellipsis' />
          </div>
          {showHistory && (
            <Link to='/history' className='history'>
              History
            </Link>
          )}

          {showSearchBar && (
            <div className='search-bar' ref={searchBarRef}>
              <ImSearch className='search' />
              <input type='text' value={searchQuery} onChange={(e) => handleSearch(e)} placeholder='Enter your keyword...' />
              <FaTimes
                className='close'
                onClick={() => {
                  setShowSearchBar(false);
                  handleCloseSearch();
                }}
              />
            </div>
          )}
        </div>

        <div className='chatbody'>
          <div className='main-chat'>
            {insert ? (
              <div className='user-ai'>
                {messages.map((message) => (
                  <div key={message.id} className={message.sender === "user" ? "user-chat" : "ai-chat"}>
                    <p dangerouslySetInnerHTML={{ __html: highlightText(message.text) }}></p>
                  </div>
                ))}
              </div>
            ) : (
              <div className='default-message'>
                <img src={robot} width={200} alt='' />
                <p>How may I be of assistance to you today? </p>
              </div>
            )}
          </div>
        </div>

        <div className='inputbox-bg'>
          <div className='text-message'>
            <div className='text-comps'>
              <ImSearch className='message-icon search' onClick={toggleSearchBar} />
              <input type='text' placeholder='Type your message here...' onChange={insertMessage} />
              <VscSend className='message-icon' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
