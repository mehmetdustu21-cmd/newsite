import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const ChatDisplay = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages') // Replace 'messages' with your actual table name
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error.message);
      } else {
        setMessages(data);
      }
    };

    // Fetch messages initially
    fetchMessages();

    // Fetch messages every 10 seconds
    const intervalId = setInterval(fetchMessages, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Latest Messages (Polling every 10s)</h2>
      {
        messages.length > 0 ? (
          <ul>
            {messages.map((message) => (
              <li key={message.id} className="mb-2 p-2 bg-gray-100 rounded">
                <p>{message.content}</p>
                <span className="text-xs text-gray-500">{new Date(message.created_at).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No messages yet. Make sure you have a 'messages' table in Supabase.</p>
        )
      }
    </div>
  );
};

export default ChatDisplay;
