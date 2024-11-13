import React, { useState, useEffect } from "react";
import '../styles/userpage.css';

function UserPage() {
    const [answerContent, setAnswerContent] = useState("");

    useEffect(() => {

        fetch("http://127.0.0.1:5000/api/answer")
            .then(res => res.text())
            .then(data => {
                setAnswerContent(data);
            })
            .catch(err => {
                console.log("Error in retrieving the article", err);
            });
    }, []);

    const sendMessage = () => {
        const userInput = document.getElementById("userInput").value;
        if (!userInput) return;

        const chatMessages = document.getElementById("chatMessages");
        chatMessages.innerHTML += `<div class="message user-message">${userInput}</div>`;
        document.getElementById("userInput").value = "";

        fetch("http://127.0.0.1:5000/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: userInput }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.response) {
                    chatMessages.innerHTML += `<div class="message bot-message">${data.response}</div>`;
                }
            })
            .catch(err => {
                console.log("Error in sending the message", err);
            });
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <div>
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
                            onKeyDown={handleKeyPress} // Add this to listen for the "Enter" key press
                        />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserPage;
