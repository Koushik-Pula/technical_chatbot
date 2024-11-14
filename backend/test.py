from flask import Flask, jsonify, request
from flask_cors import CORS
import json





app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

with open("../corpus/data_mid_2.json", 'r') as file:
    data = json.load(file)




def chatbot_response(user_input):
    
    print(user_input)
    return user_input


@app.route("/api/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message")
    if not user_input:
        return jsonify({"error": "No message provided"}), 400
    
    response = chatbot_response(user_input)
    return jsonify({"response": response})
if __name__ == "__main__":
    app.run(debug=True)
