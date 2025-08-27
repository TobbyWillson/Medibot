import "./Login.css";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import robot from "../Assets/android-robot.png";

import { FaArrowLeft, FaEllipsisV, FaTimes } from "react-icons/fa";
import { VscSend } from "react-icons/vsc";
import { ImSearch } from "react-icons/im";
import { MdMessage } from "react-icons/md";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

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

  // Load messages from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("chatMessages");
    if (stored) {
      setMessages(JSON.parse(stored));
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
    }
  }, [messages]);

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

  // -------------------- Gemini Chat --------------------
  const handleSendMessage = async () => {
    if (!insert.trim()) return;

    const userMessage = { id: Date.now(), text: insert, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInsert("");
    setLoading(true);

    try {
      // Step 1: Send message to backend to create a stream
      const { data } = await api.post(`${process.env.REACT_APP_API_URL}/chat`, { message: userMessage.text });
      const streamId = data.streamId;

      // Step 2: Prepare EventSource
      const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const eventSource = new EventSource(`${baseURL}/chat/stream/${streamId}`);

      // Add a placeholder AI message for streaming
      const aiMessageId = Date.now() + 1;
      setMessages((prev) => [...prev, { id: aiMessageId, text: "", sender: "ai" }]);

      let fullAIText = "";

      eventSource.onmessage = (event) => {
        if (event.data === "[DONE]") {
          setLoading(false);
          eventSource.close();
          setMessages((prev) => prev.map((msg) => (msg.id === aiMessageId ? { ...msg, text: fullAIText } : msg)));
        } else {
          fullAIText += event.data;
          // Update AI message in place
          setMessages((prev) => prev.map((msg) => (msg.id === aiMessageId ? { ...msg, text: fullAIText } : msg)));
        }
      };

      eventSource.onerror = (err) => {
        console.error("SSE error:", err);
        setLoading(false);
        eventSource.close();
        setMessages((prev) => prev.map((msg) => (msg.id === aiMessageId ? { ...msg, text: "⚠ Something went wrong. Please try again." } : msg)));
      };
    } catch (err) {
      console.error("Chat error:", err);
      setLoading(false);
      const errorMessage = {
        id: Date.now() + 1,
        text: "⚠ Something went wrong. Please try again.",
        sender: "ai",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // -------------------- Dynamic History --------------------
  const histories = messages.filter((msg) => msg.sender === "user"); // only user messages

  return (
    <div className='chat-interface'>
      {/* History Sidebar */}
      <div className='history-container'>
        <h1 className='heading'>History</h1>
        <div className='details-section'>
          <div className='history-details'>
            {histories.length > 0 ? (
              histories.map((h) => (
                <div key={h.id} className='each-history'>
                  <MdMessage className='message-icon' />
                  {h.text.length > 70 ? h.text.substring(0, 70) + "..." : h.text}
                </div>
              ))
            ) : (
              <p className='no-history'>No history yet</p>
            )}
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
                    {msg.sender === "user" ? (
                      <p>
                        <HighlightedText text={msg.text} query={searchQuery} />
                      </p>
                    ) : (
                      <div>
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm, remarkBreaks]}
                          components={{
                            p: ({ node, ...props }) => <p className='text-gray-200 leading-relaxed' {...props} />,
                            strong: ({ node, ...props }) => <strong className='font-bold text-white' {...props} />,
                            code: ({ node, ...props }) => <code className='bg-gray-800 text-green-400 px-1 rounded' {...props} />,
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    )}
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
