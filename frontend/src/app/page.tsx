'use client';

import { useState, useEffect } from 'react'

export default function Home() {
  const VEX_KEY = process.env.VEX_KEY

  const [team, setTeam] = useState('1165A')
  const [user, setUser] = useState<{username: string, userId: number} | null>(null)
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const buttonClass = 'border-2 p-5 rounded-xl hover:cursor-pointer'
  const inputClass = 'border-2 p-5 rounded-xl'

  // Check authentication status on page load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:5001/auth/verify', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUser({ username: data.username, userId: data.userId });
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.log('User not authenticated');
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5001/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getTeam = async () => {
    try {
      const res = await fetch('https://www.robotevents.com/api/v2/', {
          headers: {
            'Authorization': `Bearer ${VEX_KEY}`,
            'Content-Type': 'application/json'
        }
      })
      if (!res.ok) {
        throw new Error(`Response status: ${res.status}`)
      }
      console.log(res)
      const displayTeam = document.getElementById('displayTeam')
    } catch (error) {
      console.error(error)
    }
  }



  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div className="w-full flex justify-between items-center">
        <h1 id="section-1" className='text-5xl'>VEX Scouting Tool</h1>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-lg">Welcome, {user?.username}!</span>
              <button 
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <a href="/auth" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Login
            </a>
          )}
        </div>
      </div>
      <input type="text" id="teamNumber" placeholder="Search for a team number" className={inputClass} onChange={(e) => {setTeam(e.target.value)}}/>
      <button onClick={getTeam} className={buttonClass}>get Team Name</button>
      <p id="displayTeam"></p>
      <button className={buttonClass} onClick={async () => {
        try {
          const res = await fetch('http://localhost:5001/users/load', {
            credentials: 'include'
          });
          const tempNotes = await res.json();
          setNotes(tempNotes);
        } catch (error) {
          console.error('Failed to load notes:', error);
        }
      }}>Load Team Info</button>
      <button className={buttonClass}>Delete Team</button>
      <input type="text" id="description" placeholder="Enter team description" className={inputClass} onChange={(e) => {setNote(e.target.value)}}/>
      <button className={buttonClass} onClick={
        async () => {const res = await fetch(`http://localhost:5001/users/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({note: note, team: team}),
          credentials: 'include'
        }); console.log(res.status)}
      }>Upload info</button>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Notes</h2>
        {notes.length > 0 ? (
          <ul className="space-y-2">
            {notes.map((note: any) => (
              <li key={note.id} className="border p-4 rounded">
                <div><strong>Team:</strong> {note.team}</div>
                <div><strong>Note:</strong> {note.note}</div>
                <div className="text-gray-500 text-sm">{new Date(note.created_at).toLocaleDateString()}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No notes found. Click "Load Team Info" to fetch your notes.</p>
        )}
      </div>
    </div>
  );
  /*
  functions:
  teamNumber: enter a team number, read if exists, create if doesnt
  description: enter description
  upload button: upload to that team number
  deleteInfo: delete info on that team & team number

  C - add new note
  R - read past notes
  U - upload note
  D - delete old notes
  */
}
