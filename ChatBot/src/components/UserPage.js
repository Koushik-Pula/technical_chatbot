import React, { useState } from "react";
import '../styles/userpage.css';

function UserPage() {
    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [spellCorrections, setSpellCorrections] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);

    // Fetch suggestions based on prefix
    const fetchSuggestions = async (prefix) => {
        if (prefix.length > 0) {
            try {
                const response = await fetch(`http://127.0.0.1:5000/suggest?prefix=${prefix}`);
                const data = await response.json();
                setSuggestions(data);
            } catch (error) {
                console.error("Error fetching suggestions:", error);
            }
        } else {
            setSuggestions([]);
        }
    };

    // Fetch spell corrections based on input word
    const fetchSpellCorrections = async (word) => {
        if (word.length > 0) {
            try {
                const response = await fetch(`http://127.0.0.1:5000/spellcorrect?word=${word}`);
                const data = await response.json();
                setSpellCorrections(data);
            } catch (error) {
                console.error("Error fetching spell corrections:", error);
            }
        } else {
            setSpellCorrections([]);
        }
    };

    // Handle input changes
    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(value);

        const lastWord = value.split(" ").pop(); // Extract last word
        fetchSuggestions(lastWord); // Fetch suggestions
        fetchSpellCorrections(lastWord); // Fetch spell corrections
        setCurrentIndex(-1); // Reset index
    };

    // Handle suggestion selection
    const handleSuggestionClick = (suggestion) => {
        const words = inputValue.split(" ");
        words.pop(); // Remove the current prefix
        words.push(suggestion); // Add the selected suggestion
        setInputValue(words.join(" ")); // Update input field
        setSuggestions([]); // Clear suggestions
        setSpellCorrections([]); // Clear corrections
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
                    <div className="suggestions-container">
                        {suggestions.slice(0, 5).map((suggestion, index) => (
                            <div
                                key={index}
                                className={`suggestion-item ${index === currentIndex ? "highlighted" : ""}`}
                                onClick={() => handleSuggestionClick(suggestion)}
                                onMouseEnter={() => setCurrentIndex(index)}
                            >
                                {suggestion}
                            </div>
                        ))}
                    </div>
                    <div className="spell-corrections-container">
                        <h4>Did you mean:</h4>
                        {spellCorrections.map((correction, index) => (
                            <div
                                key={index}
                                className="correction-item"
                                onClick={() => handleSuggestionClick(correction)}
                            >
                                {correction}
                            </div>
                        ))}
                    </div>
                    <button>Send</button>
                </div>
            </div>
        </div>
    );
}

export default UserPage;
