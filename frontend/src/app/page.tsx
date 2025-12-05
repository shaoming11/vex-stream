'use client';

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  const VEX_KEY = process.env.VEX_KEY

  const [team, setTeam] = useState('1165A')
  const [user, setUser] = useState<{username: string, userId: number} | null>(null)
  const [notes, setNotes] = useState<Array<{id: number, team: string, note: string, created_at: string}>>([]);
  const [note, setNote] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [teamValidation, setTeamValidation] = useState<{isValid: boolean, teamName: string, isLoading: boolean}>({
    isValid: false,
    teamName: '',
    isLoading: false
  })

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
    if (!team.trim()) {
      setTeamValidation({ isValid: false, teamName: '', isLoading: false })
      return
    }

    setTeamValidation({ isValid: false, teamName: '', isLoading: true })
    
    try {
      const res = await fetch(`https://www.robotevents.com/api/v2/teams?number%5B%5D=${encodeURIComponent(team)}`, {
        headers: {
          'Authorization': `Bearer ${VEX_KEY}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!res.ok) {
        throw new Error(`Response status: ${res.status}`)
      }
      
      const data = await res.json()
      
      if (data.data && data.data.length > 0) {
        const teamData = data.data[0]
        setTeamValidation({
          isValid: true,
          teamName: teamData.team_name || `Team ${team}`,
          isLoading: false
        })
        
        // Check if this team already has a note
        const existingNote = notes.find((n: any) => n.team === team)
        if (existingNote) {
          setNote(existingNote.note)
        } else {
          setNote('')
        }
      } else {
        setTeamValidation({
          isValid: false,
          teamName: 'Team not found',
          isLoading: false
        })
      }
    } catch (error) {
      console.error('Error validating team:', error)
      setTeamValidation({
        isValid: false,
        teamName: 'Error validating team',
        isLoading: false
      })
    }
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">VEX Scouting Tool</h1>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm">Welcome, {user?.username}!</span>
                <Button variant="destructive" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button onClick={() => window.location.href = '/auth'}>
                Login
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto grid h-[calc(100vh-4rem)] grid-cols-1 gap-6 p-4 lg:grid-cols-2">
        
        {/* Left Panel - Team Search & Actions */}
        <div className="space-y-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
              <CardTitle className="text-blue-700 flex items-center gap-2">
                🔍 Team Search
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input 
                placeholder="Enter team number" 
                value={team}
                onChange={(e) => {
                  setTeam(e.target.value)
                  setTeamValidation({ isValid: false, teamName: '', isLoading: false })
                  setNote('')
                }}
              />
              <Button 
                onClick={getTeam} 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                disabled={teamValidation.isLoading}
              >
                {teamValidation.isLoading ? '🔄 Validating...' : '🎯 Validate Team'}
              </Button>
              {teamValidation.teamName && (
                <div className={`text-sm p-3 rounded-lg ${
                  teamValidation.isValid 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {teamValidation.isValid ? '✅' : '❌'} {teamValidation.teamName}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 rounded-t-xl">
              <CardTitle className="text-green-700 flex items-center gap-2">
                📝 Add Note
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!teamValidation.isValid && (
                <div className="text-sm p-3 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                  ⚠️ Please validate a team first before adding notes
                </div>
              )}
              <Input 
                placeholder={teamValidation.isValid ? `Enter note for ${teamValidation.teamName}` : "Validate team first"}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                disabled={!teamValidation.isValid}
              />
              {teamValidation.isValid && notes.find(n => n.team === team) && (
                <div className="text-sm p-2 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  ℹ️ This team already has a note. Saving will update the existing note.
                </div>
              )}
              <div className="flex gap-2">
                <Button 
                  onClick={async () => {
                    // Validate team first
                    if (!teamValidation.isValid) {
                      alert('Please validate the team first by clicking "Get Team Name"');
                      return;
                    }

                    if (!note.trim()) {
                      alert('Please enter a note');
                      return;
                    }

                    try {
                      // Check if note already exists for this team
                      const existingNote = notes.find(n => n.team === team);
                      
                      if (existingNote) {
                        // Update existing note
                        const res = await fetch(`http://localhost:5001/users/update`, {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({
                            id: existingNote.id,
                            note: note,
                            team: team
                          }),
                          credentials: 'include'
                        });
                        
                        if (res.ok) {
                          console.log('Note updated successfully');
                        } else {
                          console.error('Failed to update note');
                        }
                      } else {
                        // Create new note
                        const res = await fetch(`http://localhost:5001/users/create`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({note: note, team: team}),
                          credentials: 'include'
                        });
                        
                        if (res.ok) {
                          console.log('Note created successfully');
                        } else {
                          console.error('Failed to create note');
                        }
                      }
                      
                      // Reload notes to show updated data
                      const loadRes = await fetch('http://localhost:5001/users/load', {
                        credentials: 'include'
                      });
                      const tempNotes = await loadRes.json();
                      setNotes(tempNotes);
                      
                    } catch (error) {
                      console.error('Error saving note:', error);
                      alert('Error saving note. Please try again.');
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                  disabled={!teamValidation.isValid}
                >
                  💾 {notes.find(n => n.team === team) ? 'Update Note' : 'Save Note'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={async () => {
                    try {
                      const res = await fetch('http://localhost:5001/users/load', {
                        credentials: 'include'
                      });
                      const tempNotes = await res.json();
                      setNotes(tempNotes);
                    } catch (error) {
                      console.error('Failed to load notes:', error);
                    }
                  }}
                  className="border-purple-500 text-purple-600 hover:bg-purple-50"
                >
                  🔄 Refresh
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Notes Display */}
        <Card className="flex flex-col border-l-4 border-l-purple-500">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-xl">
            <CardTitle className="text-purple-700 flex items-center gap-2">
              📋 Team Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              {notes.length > 0 ? (
                <div className="space-y-3">
                  {notes.map((noteItem: any, index: number) => (
                    <Card key={noteItem.id} className={`border-l-4 ${index % 3 === 0 ? 'border-l-blue-400' : index % 3 === 1 ? 'border-l-green-400' : 'border-l-orange-400'} hover:shadow-md transition-all duration-200 transform hover:-translate-y-1`}>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                              🤖 Team {noteItem.team}
                            </span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              {new Date(noteItem.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{noteItem.note}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                    <div className="text-6xl mb-4">📝</div>
                    <p className="text-gray-600 mb-2 font-medium">No notes found</p>
                    <p className="text-gray-500 text-sm">
                      Click "🔄 Refresh" to load your notes or add your first note!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
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
