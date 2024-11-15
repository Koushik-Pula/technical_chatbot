import React, { useState } from "react";
import '../styles/userpage.css';

function UserPage() {
    const [inputValue, setInputValue] = useState(""); // For input field value
    const [suggestions, setSuggestions] = useState([]); // Suggestions array
    const [currentIndex, setCurrentIndex] = useState(-1); // Index for navigation

    // Fetch suggestions from Flask backend
    const fetchSuggestions = async (prefix) => {
        if (prefix.length > 0) {
            try {
                const response = await fetch(`http://127.0.0.1:5000/suggest?prefix=${prefix}`);
                const data = await response.json();
                console.log("Suggestions fetched:", data);
                setSuggestions(data);
            } catch (error) {
                console.error("Error fetching suggestions:", error);
            }
        } else {
            setSuggestions([]);
        }
    };
    
    // Handle input changes
    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(value);
        const lastWord = value.split(" ").pop(); // Extract last word
        fetchSuggestions(lastWord);
        setCurrentIndex(-1); // Reset index on input change
    };

    // Handle suggestion selection
    const handleSuggestionClick = (suggestion) => {
        const words = inputValue.split(" ");
        words.pop(); // Remove the current prefix
        words.push(suggestion); // Add the selected suggestion
        setInputValue(words.join(" ")); // Update input field
        setSuggestions([]); // Clear suggestions
    };

    // Handle keyboard navigation
    const handleKeyDown = (event) => {
        if (suggestions.length === 0) return;

        if (event.key === "ArrowDown") {
            setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, suggestions.length - 1));
        } else if (event.key === "ArrowUp") {
            setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        } else if (event.key === "Enter" && currentIndex >= 0) {
            handleSuggestionClick(suggestions[currentIndex]);
            event.preventDefault(); // Prevent form submission
        }
    };

    // Send the message to the backend
    const sendMessage = () => {
        if (!inputValue.trim()) return;

        const chatMessages = document.getElementById("chatMessages");
        chatMessages.innerHTML += `<div class="message user-message">${inputValue}</div>`;

        fetch("http://127.0.0.1:5000/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: inputValue }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.response) {
                    chatMessages.innerHTML += `<div class="message bot-message">${data.response}</div>`;
                }
                setInputValue(""); // Clear input field
                setSuggestions([]); // Clear suggestions
            })
            .catch((err) => console.error("Error sending message:", err));
    };

    return (
        <div className="UserPage">
            <div className="chat-container">
                <div className="chat-header"><h2>TechHelp</h2></div>
                <div className="chat-messages" id="chatMessages">
                    <div className="message bot-message">Hello! How can I assist you today?</div>
                </div>
                <div className="chat-input">
                    <input
                        type="text"
                        id="userInput"
                        placeholder="Type your message here..."
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                    />
                    {/* <div className="suggestions-container">
                        {suggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                className={`suggestion-item ${index === currentIndex ? "highlighted" : ""}`}
                                onClick={() => handleSuggestionClick(suggestion)}
                            >
                                {suggestion}
                            </div>
                        ))}
                    </div> */}
                    {/* <div className="suggestions-container">
    {suggestions.map((suggestion, index) => (
        <div
            key={index}
            className={`suggestion-item ${index === currentIndex ? "highlighted" : ""}`}
            onClick={() => handleSuggestionClick(suggestion)}
            onMouseEnter={() => setCurrentIndex(index)} // Update index on hover for better UX
        >
            {suggestion}
        </div>
    ))}
</div> */}
<div className="suggestions-container">
    {suggestions.slice(0, 5).map((suggestion, index) => (
        <div
            key={index}
            className={`suggestion-item ${index === currentIndex ? "highlighted" : ""}`}
            onClick={() => handleSuggestionClick(suggestion)}
            onMouseEnter={() => setCurrentIndex(index)} // Update index on hover for better UX
        >
            {suggestion}
        </div>
    ))}
</div>

                    <button onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
}

export default UserPage;
