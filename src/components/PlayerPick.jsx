export default function PlayerPick(props) {
    return(
        <div className="player-pick">
            <h2>{props.rank}</h2>
            <h2>{props.name}</h2>
            <h2>{props.position}</h2>
        </div>
    )
}
