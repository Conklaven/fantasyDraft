import './TopTen.css'; 

export default function TopTen(props) {
  const topTen = props.playersRemaining.slice(0, 10);

  const topTenList = topTen.map(player => (
    <div key={player.rank} className="player-item">
      <span className="player-details" style={{ backgroundColor: props.count > player.Rank ? 'lightgreen' : (player.want && props.ranking !== 'My Players Left' ? '#0096ff82' : '') }}>
        <div>{player.Rank}</div>
        <div>{player.name}</div>
        <div>{player.position}</div>
      <div>
      {player.notes && (
        <span className="tooltip">
          <span className="info-icon">i</span>
          <span className="tooltiptext">{player.notes}</span>
        </span>
      )}
      </div>
       
      </span>
      
    </div>
  ));

  return (
    <div className={props.className}>
      <h2 className="top-title">{props.ranking}</h2>
      <div className="player-item-list">
        {topTenList}
      </div>
    </div>
  );
}

