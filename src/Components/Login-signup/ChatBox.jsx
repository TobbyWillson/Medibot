import React, { useState, useEffect, useRef } from "react";

const ChatBox = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]); // {role: "user"/"ai", text: "message"}
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message to backend
  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", text: input }]);

    setIsLoading(true);
    setInput("");

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const { streamId } = await response.json(); // backend returns a streamId

      // Connect to SSE stream
      const eventSource = new EventSource(`http://localhost:5000/api/chat/stream/${streamId}`);

      let aiResponse = "";

      eventSource.onmessage = (event) => {
        if (event.data === "[DONE]") {
          eventSource.close();
          setIsLoading(false);
          return;
        }

        aiResponse += event.data;
        setMessages((prev) => {
          const updated = [...prev];
          if (updated[updated.length - 1]?.role === "ai") {
            updated[updated.length - 1].text = aiResponse;
          } else {
            updated.push({ role: "ai", text: aiResponse });
          }
          return updated;
        });
      };

      eventSource.onerror = (err) => {
        console.error("SSE error:", err);
        eventSource.close();
        setIsLoading(false);
      };
    } catch (err) {
      console.error("Error sending message:", err);
      setIsLoading(false);
    }
  };

  return (
    <div className='chat-container' style={{ maxWidth: 600, margin: "auto" }}>
      <div
        className='chat-box'
        style={{
          border: "1px solid #ccc",
          borderRadius: 8,
          padding: 16,
          height: 400,
          overflowY: "auto",
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              textAlign: msg.role === "user" ? "right" : "left",
              marginBottom: 8,
            }}
          >
            <span
              style={{
                background: msg.role === "user" ? "#007bff" : "#e5e5ea",
                color: msg.role === "user" ? "white" : "black",
                padding: "8px 12px",
                borderRadius: 16,
                display: "inline-block",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
        {isLoading && <p>Medibot is typing...</p>}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: "flex", marginTop: 12 }}>
        <input
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder='Describe your symptoms...'
          style={{
            flex: 1,
            padding: 10,
            border: "1px solid #ccc",
            borderRadius: 8,
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            marginLeft: 8,
            padding: "10px 16px",
            borderRadius: 8,
            background: "#007bff",
            color: "white",
            border: "none",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
