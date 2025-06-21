import React from 'react';
import './index.css'; // Make sure your main CSS (with Tailwind directives) is imported here
import ChatContainer from './components/chatcontainer';

function App() {
  return (
    <div className="App">
      <ChatContainer />
    </div>
  );
}

export default App;