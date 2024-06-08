import './index.css'

const LatestMatch = props => {
  const {matchData} = props
  const {
    competingTeam,
    competingTeamLogo,
    date,
    venue,
    result,
    firstInnings,
    secondInnings,
    manOfTheMatch,
    umpires,
  } = matchData

  return (
    <div className="latest-match-bg-container">
      <div className="competing-team-data-and-match-summary-container">
        <div className="latest-match-summary">
          <p className="competing-team-name-header">{competingTeam}</p>
          <p className="match-date">{date}</p>
          <p className="match-venue">{venue}</p>
          <p className="match-result">{result}</p>
        </div>
        <img
          className="competing-team-logo"
          src={competingTeamLogo}
          alt={`latest match ${competingTeam}`}
        />
      </div>

      <div className="latest-match-participants-and-rewards">
        <p className="innings-header">First Innings</p>
        <p className="innings-team-name">{firstInnings}</p>
        <p className="innings-header">Second Innings</p>
        <p className="innings-team-name">{secondInnings}</p>
        <p className="man-of-the-match-header">Man Of The Match</p>
        <p className="man-of-the-match">{manOfTheMatch}</p>
        <p className="umpires-header">Umpires</p>
        <p className="umpires">{umpires}</p>
      </div>
    </div>
  )
}

export default LatestMatch
