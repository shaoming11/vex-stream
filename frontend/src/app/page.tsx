'use client';

import { useState, useEffect } from 'react'

export default function Home() {
  const [team, setTeam] = useState('1165A')

  const buttonClass = 'border-2 p-5 rounded-xl hover:cursor-pointer'
  const inputClass = 'border-2 p-5 rounded-xl'

  const getTeam = async () => {
    try {
      // const res = await fetch('https://www.robotevents.com/api/v2/')
      const res = await fetch(`http://localhost:5001/users/search`)
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
        <a href="/auth" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Login
        </a>
      </div>
      <input type="text" id="teamNumber" placeholder="Search for a team number" className={inputClass} onChange={(e) => {setTeam(e.target.value)}}/>
      <button onClick={getTeam} className={buttonClass}>get Team Name</button>
      <p id="displayTeam"></p>
      <button className={buttonClass}>Load Team Info</button>
      <button className={buttonClass}>Delete Team</button>
      <input type="text" id="description" placeholder="Enter team description" className={inputClass}/>
      <button className={buttonClass}>Upload info</button>
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
