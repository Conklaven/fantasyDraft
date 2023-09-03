import { useState, useEffect } from 'react'
import './App.css'
import PlayerPick from './components/PlayerPick'
import TopTen from './components/TopTen'  
import MyTeam from './components/MyTeam'
import axios, { all } from 'axios'
import Teams from './components/Teams'

function App() {

  
  
  const teamName = [{name: "No Pun Intended", id: 0}, {name: "Rock My Junk", id: 1}, {name: "Evie's Poppy", id: 2}, {name: "Kanoschewitz", id: 3}, {name: "America's Fantasy", id: 4}, {name: "The Fighting Bogeys", id: 5}, {name: "Unoslicited Dak", id: 6}, {name: "Ray Finkle Fan Club", id: 7}, {name: "GlickMans", id: 8}, {name: "Team 11", id: 9}, {name: "Brock U", id: 10}]
  const savedState = JSON.parse(localStorage.getItem('appState'));
  const [addPlayer, setAddPlayers] = useState(savedState ? savedState.addPlayer : false);
  const [allPlayers, setAllPlayers] = useState(savedState ? savedState.allPlayers : []);
  const [teams, setTeams] = useState(savedState ? savedState.teams : Array.from({ length: 11 }, () => []));
  const [selectedTeam, setSelectedTeam] = useState(0);
  const [teamSelection, setTeamSelection] = useState(0);
  
  const [players, setPlayers] = useState(savedState ? savedState.players : []);
  const [player, setPlayer] = useState(savedState ? savedState.player : {})
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [foundPlayer, setFoundPlayer] = useState(null);
  const [myPlayers, setMyPlayers] = useState(savedState ? savedState.myPlayers : players.filter(player => player.want === true));
  const [myTeam, setMyTeam] = useState(savedState ? savedState.myTeam : []);
  const [topPlayersByPosition, setTopPlayersByPosition] = useState(savedState ? savedState.topPlayersByPosition : {
    QB: [],
    RB: [],
    WR: [],
    TE: [],
    'D/ST': [],
  });
  // set a state of myPlayer count to the count of each position in the myTeam array
  const [positionCounts, setPositionCounts] = useState( savedState ? savedState.positionCounts :  {
    QB: 0,
    RB: 0,
    WR: 0,
    TE: 0,
    'D/ST': 0,
    K: 0,
  });

  const [draftCounter, setDraftCounter] = useState(savedState ? savedState.draftCounter : {
    Round: 1,
    Pick: 1,
  });


  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem('appState'));
    if (savedState) {
      setPlayers(savedState.players);
      setAllPlayers(savedState.allPlayers);
      setMyPlayers(savedState.myPlayers);
      setMyTeam(savedState.myTeam);
      setTopPlayersByPosition(savedState.topPlayersByPosition);
      setPositionCounts(savedState.positionCounts);
      setDraftCounter(savedState.draftCounter);
    } else {
      const getPlayers = async () => {
        const res = await axios.get('https://busy-teal-scorpion-slip.cyclic.app/Players');
        const playersData = JSON.parse(JSON.stringify(res.data));
        setPlayers(playersData);
        setAllPlayers(playersData);
        myWants();
        setPlayer(res.data[0]);
        setMyPlayers(res.data.filter(player => player.want === true));
      };
      getPlayers();
    }
  }, []);

  useEffect(() => {
    
    localStorage.setItem(
      'appState',
      JSON.stringify({
        players,
        allPlayers,
        myPlayers,
        myTeam,
        topPlayersByPosition,
        positionCounts,
        draftCounter,
        teams
      })
    );
  }, [players, allPlayers, myPlayers, myTeam, topPlayersByPosition, positionCounts, draftCounter, teams]);

  const restart = () => {
    localStorage.clear();
    window.location.reload();
  };
  // set the dradt counter to the next pick in the draft where each round has 12 picks and the next pick after 12 the round goes up one
  function nextPick() {
    if (draftCounter.Pick === 12) {
      setDraftCounter(prevDraftCounter => { return{ ...prevDraftCounter, Round: draftCounter.Round + 1, Pick: 1} })
    } else {
      setDraftCounter(prevDraftCounter => { return{ ...prevDraftCounter, Pick: draftCounter.Pick + 1} })
    }
  }


  const handleSelectTeam = (e) => {
    setSelectedTeam(parseInt(e.target.value, 10));
  };

  const handleTeamSelection = (e) => {
    setTeamSelection(parseInt(e.target.value, 10));
  };
  
  function getTopPlayer(newList=players) {
    // get top remaining player from players.json
    // setPlayer to that player
    const topPlayer = newList[0];
    setPlayer(prevPlayer => { return{ ...prevPlayer, name: topPlayer.name, position: topPlayer.position, rank: topPlayer.rank} })
    
  }

  useEffect(() => {
    updateTopPlayers();
  }, [myPlayers]);

  function removePlayer(playerName) {
    setPlayers(prevPlayers => {
        const updatedPlayers = prevPlayers.filter(player => player.name !== playerName);
        return updatedPlayers;
    });

    
    nextPick();
}


  function myWants(newList=players) {
    const myPlayers = newList.filter(player => player.want === true);
    setMyPlayers(myPlayers);
  }

  function updatePositionCount(position, change) {
    setPositionCounts(prevCounts => ({
      ...prevCounts,
      [position]: prevCounts[position] + change,
    }));
  }

  function updateTopPlayers(newList=players) {
    const updatedTopPlayers = {
      QB: newList.filter(player => player.position === 'QB'),
      RB: newList.filter(player => player.position === 'RB'),
      WR: newList.filter(player => player.position === 'WR'),
      TE: newList.filter(player => player.position === 'TE'),
      'D/ST': newList.filter(player => player.position === 'D/ST'),
      K: newList.filter(player => player.position === 'K'),

    };
    setTopPlayersByPosition(updatedTopPlayers);
  }


  // function findPlayer(playerName) {
  //   // find player in players.json
  //   // setPlayer to that player
  //   const playerIndex = players.findIndex(player => player.name === playerName);
  //   const player = players[playerIndex];
  //   setPlayer(prevPlayer => { return{ ...prevPlayer, name: player.name, position: player.position, rank: player.rank} })
  // }

  function handleInputChange(event) {
    const query = event.target.value;
    if (!query) {
      setSearchQuery('');
      setSearchResults([]);
      return;
    }

    setSearchQuery(query);
    // Filter players based on the search query
    const filteredResults = allPlayers.filter(player =>
      player.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filteredResults);
  }

  function handleSearchResultClick(playerName) {
  
    const foundPlayer = allPlayers.find(player => player.name === playerName);

    if (foundPlayer) {
      setFoundPlayer(foundPlayer); // Set the found player
      setSearchQuery('');
      setSearchResults([]);
    }
    // check if found player is also in players state and if not then console.log("not found")
    const playerIndex = players.findIndex(player => player.name === playerName);
    const player = players[playerIndex];
    if (!player) {
      setAddPlayers(true);
      
    } else {
      setAddPlayers(false);
    } 

  }

  function handleRemoveFoundPlayer() {
    if (foundPlayer) {
      const playerIndex = players.findIndex(player => player.name === foundPlayer.name);
      const player = players[playerIndex];
      setTeams(prevTeams => {
        const newTeam = [...prevTeams[teamSelection], player];
        return prevTeams.map((team, index) => index === teamSelection ? newTeam : team);
      });
      
      removePlayer(foundPlayer.name);
      setFoundPlayer(null); // Clear the found player
    }
  }

  function putPlayerOnMyTeam() {
    if (foundPlayer) {
      const playerIndex = players.findIndex(player => player.name === foundPlayer.name);
      const player = players[playerIndex];
      setMyTeam(prevMyTeam => [...prevMyTeam, player]);
      removePlayer(foundPlayer.name);
      setFoundPlayer(null); // Clear the found player
      updatePositionCount(player.position, 1); // Increase the count
    }
  }



  function addPlayerBack() {
    if (foundPlayer) {
      //set the pick count back to the previous pick
      if (draftCounter.Pick === 1) {
        setDraftCounter(prevDraftCounter => { return{ ...prevDraftCounter, Round: draftCounter.Round - 1, Pick: 12} })
      } else {
        setDraftCounter(prevDraftCounter => { return{ ...prevDraftCounter, Pick: draftCounter.Pick - 1} })
      }
  
      

      const playerIndex = allPlayers.findIndex(player => player.name === foundPlayer.name);
      const player = allPlayers[playerIndex];
      setMyTeam(prevMyTeam => {
        const myTeamIndex = prevMyTeam.findIndex(player => player.name === foundPlayer.name);
        if (myTeamIndex !== -1) {
          // remove from my team
          const newMyTeam = prevMyTeam.filter(player => player.name !== foundPlayer.name);
          updatePositionCount(foundPlayer.position, -1); // Decrease the count
          return newMyTeam;
        }
        return prevMyTeam;
      });
      setTeams(prevTeams => {
        const newTeam = prevTeams[teamSelection].filter(player => player.name !== foundPlayer.name);
        return prevTeams.map((team, index) => index === teamSelection ? newTeam : team);
      }
      );

      setPlayers(prevPlayers => {
        const newPlayers = prevPlayers.slice();
        const correctIndex = newPlayers.findIndex(p => p.Rank > player.Rank);
        newPlayers.splice(correctIndex, 0, player);
        return newPlayers;
      });
      setFoundPlayer(null); // Clear the found player
    }
  }

  useEffect(() => {
    if (players && players.length > 0) {
      getTopPlayer(players);
      myWants(players);
      updateTopPlayers(players);
    }
  }, [players]);

  function clearPlayer() {
    if (foundPlayer) {
      setFoundPlayer(null); // Clear the found player
    }
  }

  return (
    <>
    <button className='restart-draft-button' onClick={() => {
      if (window.confirm("Are you sure you want to restart the draft?")) {
          restart();
      }
    }}>Restart Draft</button>
    <div className="App">
    <PlayerPick className="top-overall" name={player ? player.name : ''} position={player ? player.position : ''} rank={player ? player.rank : ''} ranking="Top Players Left"/>
      <div className='position-count'> 
          <span className='count-title'>Position Count</span>
          <span className='qb-count count'>QB: {positionCounts.QB}/1 </span>
          <span className='rb-count count'>RB: {positionCounts.RB}/2 </span>
          <span className='wr-count count'>WR: {positionCounts.WR}/2 </span>
          <span className='te-count count'>TE: {positionCounts.TE}/1 </span>
          <span className='d-count count'>D/ST: {positionCounts['D/ST']}/1 </span>
          <span className='k-count count'>K: {positionCounts.K}/1 </span>

      </div>

      <div className='draft-counter'>
        <div className='draft-counter-title'>
          Draft Counter
        </div>
        <div className='draft-counter-count'>
          <div className='round-count'>
          <span className='round-title'>Round: </span> {draftCounter.Round}
          </div>
          <div className='pick-count'>
            <span className='pick-title'>Pick: </span> {draftCounter.Pick}
          </div>
        </div>
      </div>

      <TopTen className='top-remaining' playersRemaining={players}  count={draftCounter.Pick} ranking="Top Overall Left"/>
      {!foundPlayer && (
      <div className='search-bar-container'>
        <input
          type="text"
          placeholder="Enter Player Name"
          value={searchQuery}
          onChange={handleInputChange}
          className='search-bar'
        />
      </div>
      )}

      {foundPlayer && (
        <div className='selected-player'>
          Selected Player: {foundPlayer.Rank} {foundPlayer.name} {foundPlayer.position} 
        </div>
      )}
      <div className='player-results'>
        {searchResults.map(result => (
          <div
            key={result.name}
            onClick={() => handleSearchResultClick(result.name)}
            className="search-result"
          >
            {`${result.Rank} ${result.name} ${result.position}`}
          </div>
        ))}
      </div>
      {foundPlayer && (
        
        <div className='options'>
          {!addPlayer && (
            <>
            <div className='team-select'>
                <select className='team-dropdown' onChange={handleTeamSelection}>
                  {teams.map((_, index) => {
                      console.log("teamName", teamName);
                      console.log("index", index);
                      const selectedTeamName = teamName.find(team => team.id === index);
                      console.log("selectedTeamName", selectedTeamName);
                      return (
                        <option key={index} value={index}>
                          {selectedTeamName? selectedTeamName.name : `Team ${index + 1}`}
                        </option>
                      )
                    })}
                </select>
              </div>
              <div className='remove-container'>
                <button className='remove-button btn' onClick={handleRemoveFoundPlayer}>Remove Drafted Player</button>
              </div>
              <div className='pick-container'>
                <button className='pick-button btn' onClick={putPlayerOnMyTeam}>Draft Player to My Team</button>
              </div>
              
            </>
          )}
          {addPlayer && (
            <>
              <div className='add-container'>
                <button className='add-button btn' onClick={addPlayerBack}>Add Player Back</button>
              </div>
            </>
          )}
          <div className='clear-container'>
            <button className='clear-button btn' onClick={clearPlayer}>Clear Selection</button>
          </div>
        </div>
        
      )}
    </div>
    <TopTen className='players-left' playersRemaining={myPlayers} ranking="My Players Left"  count={draftCounter.Pick}/>
    <MyTeam className='my-team' myTeam={myTeam} />
    <div className='top-players-by-position'>
      <TopTen className='top-qbs top-section' playersRemaining={topPlayersByPosition.QB} ranking="Top Qbs Left" count={draftCounter.Pick}/>
      <TopTen className='top-rbs top-section' playersRemaining={topPlayersByPosition.RB} ranking="Top Running Backs Left" count={draftCounter.Pick}/>
      <TopTen className='top-wrs top-section' playersRemaining={topPlayersByPosition.WR} ranking="Top Wide Recievers Left" count={draftCounter.Pick}/>
      <TopTen className='top-tes top-section' playersRemaining={topPlayersByPosition.TE} ranking="Top Tight Ends Left" count={draftCounter.Pick}/>
      <TopTen className='top-dfs top-section' playersRemaining={topPlayersByPosition['D/ST']} ranking="Top Defense Left" count={draftCounter.Pick}/>
    </div>

    <div className='teams-container'>
    <select className='team-selector' onChange={handleSelectTeam}>
        {teams.map((_, index) => {
          console.log("teamName", teamName);
          console.log("index", index);
          const selectedTeamName = teamName.find(team => team.id === index);
          console.log("selectedTeamName", selectedTeamName);
          return (
            <option key={index} value={index}>
              {selectedTeamName? selectedTeamName.name : `Team ${index + 1}`}
            </option>
          )
        })}
    </select>

      <Teams teams={teams} selectedTeam={selectedTeam} teamName={teamName}/>
    </div>
   
    </>
  )
}

export default App
