import './App.css'
import { useState } from 'react';

const header = {
    headers: {
    'Authorization': `Bearer API_KEY`
    }
};

function App() {
  const [matchNumbers, setMatchNumbers] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const getEventId = async (sku: string) => {
    const request = new Request(`https://www.robotevents.com/api/v2/events?sku[]=${sku}`, header)
    const response = await fetch(request);
    const data = await response.json();
    console.log(data.data[0].id);
    return data.data[0].id
  };
  
  const getTeamId = async (teamNumber: string) => {
    const request = new Request(`https://www.robotevents.com/api/v2/teams?number[]=${teamNumber}`, header)
    const response = await fetch(request);
    const data = await response.json();
    return data.data[1].id
  };

  const getTeamMatches = async (teamId: number, eventId: number) => {
    const request = new Request(`https://www.robotevents.com/api/v2/teams/${teamId}/matches?event[]=${eventId}`, header)
    const response = await fetch(request);
    const data = await response.json();
    return data.data
  }

  const getMatchList = async (matches: any[]) => {
    let matchlist: number[] = []; // Properly typed array of numbers
    for (let match of matches) {
        matchlist.push(match.matchnum);
    }
    return matchlist;
  }

  const teamInfo = async () => {
    try {
      setLoading(true);
      const sku = 'RE-VRC-22-7740';
      
      const teamId = await getTeamId('515R');
      const eventId = await getEventId(sku);
      const matches = await getTeamMatches(teamId, eventId);
      
      // Get match numbers and set to state
      const matchList = await getMatchList(matches);
      setMatchNumbers(matchList);
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={teamInfo} disabled={loading}>
        {loading ? 'Loading...' : 'Get Match Numbers'}
      </button>
      
      {/* Display the match numbers */}
      {matchNumbers.length > 0 && (
        <div>
          <h3>Match Numbers:</h3>
          <ul>
            {matchNumbers.map((matchNum, index) => (
              <li key={index}>Match {matchNum}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App
