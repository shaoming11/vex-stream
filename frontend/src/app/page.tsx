'use client';

import { useState, useEffect } from 'react'

export default function Home() {
  const [team, setTeam] = useState('1165')

  const addTeam = () => {
    
  }

  useEffect(() => {
      const teamNumber = document.getElementById('teamNumber') as HTMLInputElement
      setTeam(teamNumber?.value || '')
      document.title = team
    }, [team]
  )

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1>Vex Stream</h1>
      <input type="text" id="teamNumber" placeholder="Search for a team number" className="border-2"/>
      <button onClick={addTeam}>Add Team</button>
      <button>Load Team Info</button>
      <button>Delete Team</button>
      <input type="text" id="description" placeholder="Enter team description" className="border-2"/>
      <button>Upload info</button>
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
