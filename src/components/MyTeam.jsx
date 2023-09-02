export default function MyTeam(props){
    // return a list of players in myTeam
    console.log("props.myTeam", props.myTeam);
    const myTeamList = props.myTeam.map(player => <div key={player.rank}>{player.Rank} {player.name} {player.position}</div>)
    
    return(
        <div className="my-team">
            <h2 className="my-team-title">My Team</h2>
            {myTeamList}
        </div>
    )
}