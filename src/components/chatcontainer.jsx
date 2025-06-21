import React, { useState, useRef, useEffect, useMemo } from "react";
import Message from "./message";
import { GoogleGenerativeAI } from "@google/generative-ai";

const LOCAL_STORAGE_KEY = "geminiChatHistory";

function ChatContainer() {
  const [messages, setMessages] = useState(() => {
    try {
      const storedHistory = localStorage.getItem(LOCAL_STORAGE_KEY);
      return storedHistory ? JSON.parse(storedHistory) : [];
    } catch (error) {
      console.error(
        "Failed to load chat history from localStorage on initialization:",
        error
      );
      localStorage.removeItem(LOCAL_STORAGE_KEY); 
      return [];
    }
  });
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContentRef = useRef(null);
  const inputRef = useRef(null);

  const API_KEY = process.env.REACT_APP_CHAT_AI_GEMINI_API_KEY;

  const genAI = useMemo(() => {
    if (!API_KEY) {
      console.error("Missing Gemini API Key. Please set it in your .env file.");
      return null;
    }
    return new GoogleGenerativeAI(API_KEY);
  }, [API_KEY]);

  const model = useMemo(() => {
    return genAI
      ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      : null;
  }, [genAI]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedHistory) {
        setMessages(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load chat history from localStorage:", error);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error("Failed to save chat history to localStorage:", error);
    }
  }, [messages]);

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function generateGeminiResponse(userMessage) {
    if (!model) {
      return "AI model not initialized. Please check your API configuration and API key.";
    }

    try {
      setIsLoading(true);
      console.log("Sending prompt to Gemini:", userMessage);
      const chatHistory = messages.map((msg) => ({
        role: msg.fromUser ? "user" : "model",
        parts: [{ text: msg.text }],
      }));

      const chat = model.startChat({
        history: chatHistory,
        generationConfig: {
          maxOutputTokens: 300,
        },
      });

      const result = await chat.sendMessage(userMessage);
      const response = await result.response;
      const text = response.text();

      console.log("Gemini Response:", text);
      return text;
    } catch (error) {
      console.error("Error communicating with Gemini API:", error);

      if (error.message.includes("403")) {
        return "Access denied. Please check your API key or usage limits (403 Forbidden).";
      } else if (error.message.includes("429")) {
        return "Too many requests. Please wait a moment and try again (429 Too Many Requests).";
      } else if (error.message.includes("404")) {
        return "Model not found or unavailable. Please check the model name or API version (404 Not Found).";
      }
      return "There was an unexpected error. Please try again later.";
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const currentUserMessage = userInput.trim();
    if (!currentUserMessage) {
      return;
    }

    setMessages((prev) => [
      ...prev,
      { text: currentUserMessage, fromUser: true },
    ]);
    setUserInput("");
    const botResponse = await generateGeminiResponse(currentUserMessage);
    setMessages((prev) => [...prev, { text: botResponse, fromUser: false }]);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-blue-600 text-white p-4 text-center text-xl font-semibold">
        Gran AI Chat Assistant
      </div>

      <div
        ref={chatContentRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((msg, index) => (
          <Message key={index} message={msg.text} fromUser={msg.fromUser} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 max-w-md px-4 py-2 rounded-lg my-2">
              <span className="animate-pulse">Typing...</span>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-4 bg-white border-t border-gray-200 flex"
      >
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-3 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || !userInput.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatContainer;
