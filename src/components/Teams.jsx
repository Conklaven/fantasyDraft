export default function Teams(props) {
    console.log("props", props.teamName);
    // return a list of players in selected team
    const teamList = props.teams[props.selectedTeam].map(player =>  <div key={player.rank} className="team-list-names">{player.Rank} {player.name} {player.position}</div> )
    const selectedTeamName = props.teamName.find(team => team.id === props.selectedTeam).name;
    return(
        <>
        <div className="teams">
            <h2 className="team-name">{selectedTeamName}</h2>
            {console.log("teamList", teamList)}
            <div className="team-list-container">
                {teamList}
            </div>
        </div>
        </>
        
    );
  }