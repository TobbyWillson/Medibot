import "./Login.css";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import robot from "../Assets/android-robot.png";

import { FaArrowLeft, FaEllipsisV, FaTimes } from "react-icons/fa";
import { VscSend } from "react-icons/vsc";
import { ImSearch } from "react-icons/im";
import { MdMessage } from "react-icons/md";

import api from "../../api"; // axios instance

// Safe Highlight Component
const HighlightedText = ({ text, query }) => {
  if (!query) return <>{text}</>;
  const regex = new RegExp(`(${query})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={i} className='highlight'>
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};

const ChatPage = () => {
  const [insert, setInsert] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showHistory, setShowHistory] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchBarRef = useRef(null);
  const chatEndRef = useRef(null);

  const navigate = useNavigate();

  // History toggle
  const toggleVisibility = (e) => {
    e.stopPropagation();
    setShowHistory((prev) => !prev);
  };
  const closeHistory = () => setShowHistory(false);
  useEffect(() => {
    document.body.addEventListener("click", closeHistory);
    return () => document.body.removeEventListener("click", closeHistory);
  }, []);

  // Search toggle
  const toggleSearchBar = (e) => {
    e.stopPropagation();
    setShowSearchBar((prev) => !prev);
  };
  const closeSearchBar = (e) => {
    if (searchBarRef.current && !searchBarRef.current.contains(e.target)) {
      setShowSearchBar(false);
    }
  };
  useEffect(() => {
    document.body.addEventListener("click", closeSearchBar);
    return () => document.body.removeEventListener("click", closeSearchBar);
  }, []);
  const handleSearch = (e) => setSearchQuery(e.target.value.toLowerCase());
  const handleCloseSearchQuery = () => setSearchQuery("");

  // -------------------- SSE Streaming --------------------
  const handleSendMessage = async () => {
    if (!insert.trim()) return;

    const userMessage = { id: Date.now(), text: insert, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInsert("");
    setLoading(true);

    const aiMessage = { id: Date.now() + 1, text: "", sender: "ai" };
    setMessages((prev) => [...prev, aiMessage]);

    try {
      // 1️⃣ Send user message to backend, get streamId + chatId
      const { data } = await api.post("/chat", { message: userMessage.text });
      const { streamId, chatId } = data;

      // 2️⃣ Open SSE connection
      const eventSource = new EventSource(`${process.env.REACT_APP_API_URL}/chat/stream/${streamId}?chatId=${chatId}`);

      eventSource.onmessage = (event) => {
        if (event.data === "[DONE]") {
          eventSource.close();
          setLoading(false);
        } else {
          setMessages((prev) => prev.map((msg) => (msg.id === aiMessage.id ? { ...msg, text: msg.text + event.data } : msg)));
        }
      };

      eventSource.onerror = (err) => {
        console.error("SSE error:", err);
        setLoading(false);
        setMessages((prev) => prev.map((msg) => (msg.id === aiMessage.id ? { ...msg, text: "⚠️ Something went wrong. Please try again." } : msg)));
        eventSource.close();
      };
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => prev.map((msg) => (msg.id === aiMessage.id ? { ...msg, text: "⚠️ Something went wrong. Please try again." } : msg)));
      setLoading(false);
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Dummy chat history
  const histories = [
    { id: 1, text: "What are the common symptoms of hypothyroidism and how is it treated?" },
    { id: 2, text: "Can you explain the causes and effects of high blood pressure?" },
    { id: 3, text: "How do I manage stress and anxiety during lockdown?" },
  ];

  return (
    <div className='chat-interface'>
      {/* History Sidebar */}
      <div className='history-container'>
        <h1 className='heading'>History</h1>
        <div className='details-section'>
          <div className='history-details'>
            {histories.map((h) => (
              <div key={h.id} className='each-history'>
                <MdMessage className='message-icon' />
                {h.text.substring(0, 70) + "..."}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Section */}
      <div className='overall-chat'>
        <div className='chat-nav'>
          <FaArrowLeft onClick={() => navigate(-1)} className='backbutton' />
          <p>Chat with Medibot</p>
          <FaEllipsisV onClick={toggleVisibility} className='ellipsis' />
          {showHistory && (
            <Link to='/history' className='history'>
              History
            </Link>
          )}
          {showSearchBar && (
            <div className='search-bar' ref={searchBarRef}>
              <ImSearch className='search' />
              <input type='text' value={searchQuery} onChange={handleSearch} placeholder='Enter your keyword...' />
              <FaTimes className='close' onClick={handleCloseSearchQuery} />
            </div>
          )}
        </div>

        <div className='chatbody'>
          <div className='main-chat'>
            {messages.length > 0 ? (
              <div className='user-ai'>
                {messages.map((msg) => (
                  <div key={msg.id} className={msg.sender === "user" ? "user-chat" : "ai-chat"}>
                    <p>
                      <HighlightedText text={msg.text} query={searchQuery} />
                    </p>
                  </div>
                ))}
                {loading && <p className='loading'>Medibot is typing...</p>}
                <div ref={chatEndRef} />
              </div>
            ) : (
              <div className='default-message'>
                <img src={robot} width={200} alt='medibot' />
                <p>How may I be of assistance to you today?</p>
              </div>
            )}
          </div>
        </div>

        {/* Input Box */}
        <div className='inputbox-bg'>
          <div className='text-message'>
            <div className='text-comps'>
              <ImSearch className='message-icon search' onClick={toggleSearchBar} />
              <input type='text' value={insert} placeholder='Type your message here...' onChange={(e) => setInsert(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} />
              <VscSend className='message-icon' onClick={handleSendMessage} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
