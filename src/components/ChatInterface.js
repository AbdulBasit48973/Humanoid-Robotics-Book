import React, { useState, useRef } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [useSelectedText, setUseSelectedText] = useState(false);
  const messagesEndRef = useRef(null);

  // Function to scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Effect to scroll to bottom when messages change
  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to get selected text from the page
  const getSelectedText = () => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      setSelectedText(selectedText);
      setUseSelectedText(true);
    } else {
      alert('Please select some text on the page first.');
    }
  };

  // Function to send a message to the backend
  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { type: 'user', content: inputValue };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      let response;

      if (useSelectedText && selectedText) {
        // Use the query-with-selection endpoint
        const res = await fetch('http://localhost:8000/api/v1/query-with-selection', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: inputValue,
            selection: selectedText
          })
        });
        response = await res.json();
      } else {
        // Use the regular query endpoint
        const res = await fetch('http://localhost:8000/api/v1/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: inputValue
          })
        });
        response = await res.json();
      }

      const botMessage = {
        type: 'bot',
        content: response.answer,
        sources: response.sources || []
      };

      setMessages([...newMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.'
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Reset the selected text mode
  const resetSelectedText = () => {
    setSelectedText('');
    setUseSelectedText(false);
  };

  return (
    <div className="chat-container" style={{
      maxWidth: '800px',
      margin: '2rem auto',
      border: '1px solid #ddd',
      borderRadius: '8px',
      height: '600px',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div className="chat-header" style={{
        backgroundColor: '#25c2a0',
        color: 'white',
        padding: '1rem',
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px'
      }}>
        <h3>Humanoid Robotics Book Assistant</h3>
        <p>Ask questions about Physical AI & Humanoid Robotics</p>
      </div>

      <div className="chat-messages" style={{
        flex: 1,
        padding: '1rem',
        overflowY: 'auto',
        backgroundColor: '#fafafa'
      }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>
            <p>Hello! I'm your Humanoid Robotics Book assistant.</p>
            <p>You can ask me questions about the content in this book.</p>
            <p>I can also answer questions based on selected text on the page.</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              style={{
                marginBottom: '1rem',
                textAlign: msg.type === 'user' ? 'right' : 'left'
              }}
            >
              <div style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                backgroundColor: msg.type === 'user' ? '#25c2a0' : '#e9ecef',
                color: msg.type === 'user' ? 'white' : '#333',
                maxWidth: '80%',
                wordWrap: 'break-word'
              }}>
                {msg.content}
              </div>
              {msg.sources && msg.sources.length > 0 && (
                <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                  <strong>Sources:</strong>
                  <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                    {msg.sources.slice(0, 3).map((source, idx) => (
                      <li key={idx}>
                        <a href={source.url} target="_blank" rel="noopener noreferrer">
                          {source.title || 'Source'}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
            <div style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              backgroundColor: '#e9ecef',
              color: '#333'
            }}>
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {useSelectedText && selectedText && (
        <div style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          padding: '0.5rem',
          margin: '0.5rem',
          borderRadius: '4px',
          fontSize: '0.9rem'
        }}>
          <strong>Using selected text:</strong> "{selectedText.substring(0, 100)}..."
          <button
            onClick={resetSelectedText}
            style={{
              marginLeft: '0.5rem',
              padding: '0.2rem 0.5rem',
              fontSize: '0.8rem'
            }}
          >
            Clear
          </button>
        </div>
      )}

      <div className="chat-input-area" style={{
        padding: '1rem',
        borderTop: '1px solid #ddd',
        backgroundColor: 'white'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <button
            onClick={getSelectedText}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Use Selected Text
          </button>
          <button
            onClick={() => setUseSelectedText(!useSelectedText)}
            disabled={!selectedText}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: useSelectedText ? '#2ecc71' : '#bdc3c7',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: selectedText ? 'pointer' : 'not-allowed'
            }}
          >
            {useSelectedText ? 'Using Selection' : 'Toggle Selection Mode'}
          </button>
        </div>

        <div style={{ display: 'flex' }}>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question about humanoid robotics..."
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              resize: 'vertical',
              minHeight: '60px'
            }}
            rows={2}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !inputValue.trim()}
            style={{
              marginLeft: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: isLoading || !inputValue.trim() ? '#bdc3c7' : '#25c2a0',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading || !inputValue.trim() ? 'not-allowed' : 'pointer'
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

const ChatComponent = () => {
  return (
    <BrowserOnly>
      {() => <ChatInterface />}
    </BrowserOnly>
  );
};

export default ChatComponent;