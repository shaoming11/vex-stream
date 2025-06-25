import { useState } from 'react';
// import axios from 'axios';

// Types

const HomePage = () => {
  const [message] = useState<string>('');

  const fetchMessage = async () => {
    fetch("http://localhost:8000/data")
    .then(res => res.json())
    .then(data => console.log(data))
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Simple MERN App</h1>
      <button onClick={fetchMessage}>
        Get Message from Backend
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default HomePage