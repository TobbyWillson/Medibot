import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const messages = [
    { id: 1, text: "Hello, I need a new keyboard for my laptop." },
    { id: 2, text: "What kind of keyboard are you looking for?" },
    { id: 3, text: "I want a wireless keyboard with good battery life." },
  ];

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const highlightText = (text) => {
    if (!searchQuery) return text;
    const regex = new RegExp(searchQuery, "gi");
    return text.replace(regex, (match) => `<span class='highlight'>${match}</span>`);
  };

  return (
    <div>
      <input type='text' value={searchQuery} onChange={handleSearch} placeholder='Search...' />
      <ul>
        {messages.map((message) => (
          <li key={message.id}>
            <p dangerouslySetInnerHTML={{ __html: highlightText(message.text) }}></p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchPage;
