import {Component} from 'react'
import Loader from 'react-loader-spinner'

import LatestMatch from '../LatestMatch'
import MatchCard from '../MatchCard'

import './index.css'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

let teamMatchesApiUrl = 'https://apis.ccbp.in/ipl/'

const teamBackgroundGradientStyleMapping = {
  RCB: 'rcb-background',
  KKR: 'kkr-background',
  KXP: 'kxp-background',
  CSK: 'csk-background',
  RR: 'rr-background',
  MI: 'mi-background',
  SH: 'sh-background',
  DC: 'dc-background',
}

export default class TeamMatches extends Component {
  state = {
    isLoading: true,
    teamAndMatchesData: {},
  }

  componentDidMount() {
    this.fetchTeamAndMatchesData()
  }

  componentWillUnmount() {
    teamMatchesApiUrl = 'https://apis.ccbp.in/ipl/' // To reset the url upon consecutive requests and avoid duplication of id
  }

  fetchTeamAndMatchesData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    teamMatchesApiUrl += id

    const teamAndMatchesDataAPIResponse = await fetch(teamMatchesApiUrl)
    const fetchedTeamAndMatchesData = await teamAndMatchesDataAPIResponse.json()
    const formattedTeamAndMatchesData = {
      teamBannerUrl: fetchedTeamAndMatchesData.team_banner_url,
      latestMatchDetails: {
        id: fetchedTeamAndMatchesData.latest_match_details.id,
        date: fetchedTeamAndMatchesData.latest_match_details.date,
        venue: fetchedTeamAndMatchesData.latest_match_details.venue,
        result: fetchedTeamAndMatchesData.latest_match_details.result,
        competingTeam:
          fetchedTeamAndMatchesData.latest_match_details.competing_team,
        competingTeamLogo:
          fetchedTeamAndMatchesData.latest_match_details.competing_team_logo,
        firstInnings:
          fetchedTeamAndMatchesData.latest_match_details.first_innings,
        secondInnings:
          fetchedTeamAndMatchesData.latest_match_details.second_innings,
        matchStatus:
          fetchedTeamAndMatchesData.latest_match_details.match_status,
        manOfTheMatch:
          fetchedTeamAndMatchesData.latest_match_details.man_of_the_match,
        umpires: fetchedTeamAndMatchesData.latest_match_details.umpires,
      },
      recentMatches: fetchedTeamAndMatchesData.recent_matches.map(
        recentMatchDataItem => ({
          umpires: recentMatchDataItem.umpires,
          result: recentMatchDataItem.result,
          manOfTheMatch: recentMatchDataItem.man_of_the_match,
          id: recentMatchDataItem.id,
          date: recentMatchDataItem.date,
          venue: recentMatchDataItem.venue,
          competingTeam: recentMatchDataItem.competing_team,
          competingTeamLogo: recentMatchDataItem.competing_team_logo,
          firstInnings: recentMatchDataItem.first_innings,
          secondInnings: recentMatchDataItem.second_innings,
          matchStatus: recentMatchDataItem.match_status,
        }),
      ),
    }

    this.setState({
      isLoading: false,
      teamAndMatchesData: formattedTeamAndMatchesData,
    })
  }

  render() {
    const {isLoading, teamAndMatchesData} = this.state
    const {teamBannerUrl, latestMatchDetails, recentMatches} =
      teamAndMatchesData

    const {match} = this.props
    const {params} = match
    const {id} = params
    const teamBackgroundGradientStylingClass =
      teamBackgroundGradientStyleMapping[id]

    return (
      <div
        className={`team-matches-bg-container ${teamBackgroundGradientStylingClass}`}
      >
        {isLoading ? (
          <div testid="loader">
            <Loader type="Oval" color="#ffffff" height={50} width={50} />
          </div>
        ) : (
          <>
            <img
              className="team-matches-top-image"
              src={teamBannerUrl}
              alt="team banner"
            />
            <h1 className="team-latest-matches-header">Latest Matches</h1>
            <LatestMatch matchData={latestMatchDetails} />
            <ul className="team-match-card-collection">
              {recentMatches.map(recentMatchDataItem => (
                <MatchCard
                  key={recentMatchDataItem.id}
                  matchCardData={recentMatchDataItem}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    )
  }
}
