import './App.css'
import { useState } from 'react';

function App() {
  const [message] = useState<string>('');

  const fetchMessage = async () => {
    fetch("http://localhost:8000/data")
    .then(res => res.json())
    .then(data => console.log(data))
  };

  async function getEvents() {
    const request = new Request('https://www.robotevents.com/api/v2/events?sku=RE-V5RC-25-9925', {
      headers: {
        'Authorization': 'Bearer API_KEY'
      }
    })
    const response = await fetch(request);
    const data = await response.json();
    console.log(data);
  }

  async function getTime() {
    const response = await fetch('http://worldtimeapi.org/api/timezone/America/New_York');
    const data = await response.json();
    console.log(data)
  }

  return (
    <>
      <div>
        <h1>Simple MERN App</h1>
        <button onClick={fetchMessage}>
          Get Message from Backend
        </button>
        <button onClick={getTime}>
          load time
        </button>
        <button onClick={getEvents}>
          load events
        </button>
        {message && <p>{message}</p>}
      </div>
    </>
  );
}

export default App
