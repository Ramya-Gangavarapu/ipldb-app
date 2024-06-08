import {Link} from 'react-router-dom'
import './index.css'

const TeamCard = props => {
  const {cardData} = props
  const {id, name, teamImageUrl} = cardData

  return (
    <Link className="team-card-routing-link" to={`/team-matches/${id}`}>
      <li className="team-card-container">
        <img className="team-image" src={teamImageUrl} alt={name} />
        <p className="team-name">{name}</p>
      </li>
    </Link>
  )
}

export default TeamCard
