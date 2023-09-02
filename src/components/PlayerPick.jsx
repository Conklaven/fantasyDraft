export default function PlayerPick(props) {
    return(
        <div className="player-pick">
            <h2>{props.name}</h2>
            <h3>{props.position}</h3>
            <h3>{props.rank}</h3>
        </div>
    )
}
