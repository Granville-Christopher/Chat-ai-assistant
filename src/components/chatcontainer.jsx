import React, { useState, useRef, useEffect, useMemo } from "react";
import Message from "./message";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";

const LOCAL_STORAGE_KEY = "geminiChatHistory";

function ChatContainer() {
  const [messages, setMessages] = useState(() => {
    try {
      const storedHistory = localStorage.getItem(LOCAL_STORAGE_KEY);
      return storedHistory ? JSON.parse(storedHistory) : [];
    } catch (error) {
      console.error("Failed to load chat history:", error);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      return [];
    }
  });

  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const chatContentRef = useRef(null);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);
  const sidebarRef = useRef(null);
  const API_KEY = process.env.REACT_APP_CHAT_AI_GEMINI_API_KEY;

  const genAI = useMemo(() => {
    if (!API_KEY) {
      console.error("Missing Gemini API Key.");
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
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error("Failed to save chat history:", error);
    }
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowScrollButton(!entry.isIntersecting);
      },
      { root: null, threshold: 1.0 }
    );

    const currentBottomRef = bottomRef.current;
    if (currentBottomRef) observer.observe(currentBottomRef);

    return () => {
      if (currentBottomRef) observer.unobserve(currentBottomRef);
    };
  }, [messages]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const [darkMode, setDarkMode] = useState(false);

  const clearChat = () => {
    localStorage.removeItem("geminiChatHistory");
    setMessages([]);
    setSidebarOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    }

    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  async function generateGeminiResponse(userMessage) {
    if (!model) return "AI model not initialized. Please check your API key.";

    try {
      setIsLoading(true);
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
      return response.text();
    } catch (error) {
      console.error("Gemini error:", error);
      if (error.message.includes("403")) return "403 Forbidden. Check API key.";
      if (error.message.includes("429")) return "Too many requests. Try again.";
      if (error.message.includes("404")) return "Model not found.";
      return "Unexpected error. Try later.";
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const currentUserMessage = userInput.trim();
    if (!currentUserMessage) return;

    setMessages((prev) => [
      ...prev,
      { text: currentUserMessage, fromUser: true },
    ]);
    setUserInput("");

    const botResponse = await generateGeminiResponse(currentUserMessage);
    setMessages((prev) => [...prev, { text: botResponse, fromUser: false }]);
  };

  return (
    <section
      className={`flex flex-col overflow-x-hidden h-screen space-y-4 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div className="bg-blue-600 flex justify-between items-center fixed z-50 top-0 w-full text-white p-4 text-xl font-semibold">
        <div className="relative">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white text-lg focus:outline-none"
          >
            <FontAwesomeIcon icon={faEllipsis} />
          </button>

          {sidebarOpen && (
            <div
              ref={sidebarRef}
              className="absolute top-10 left-0 bg-white text-black text-sm rounded shadow-md p-2 z-50"
            >
              <button
                onClick={clearChat}
                className="hover:bg-gray-100 whitespace-nowrap px-2 py-1 w-full text-left"
              >
                Clear Chat
              </button>
            </div>
          )}
        </div>

        <span>Gran AI</span>

        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="ml-4 bg-white text-blue-600 px-3 py-1 rounded text-sm shadow"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      <div className="flex-grow pt-16 whitespace-pre-wrap">
        <div
          ref={chatContentRef}
          className={`grow overflow-y-auto pb-24 pt-4 space-y-4 ${
            darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
          }`}
        >
          {messages.map((msg, index) => (
            <Message
              key={index}
              message={msg.text}
              fromUser={msg.fromUser}
              darkMode={darkMode}
            />
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className=" max-w-md py-2 rounded-lg my-2">
                <span className="animate-pulse">Typing...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="fixed bottom-24 right-4 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg animate-bounce z-50"
          >
            ↓ New Message
          </button>
        )}

        <form
          onSubmit={handleSubmit}
          className="p-4 bg-white border-t fixed bottom-0 w-full border-gray-200 flex"
        >
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 text-gray-900 p-3 font-semibold border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
    </section>
  );
}

export default ChatContainer;
