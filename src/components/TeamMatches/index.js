import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {PieChart, Pie, Legend, Cell} from 'recharts'
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

class TeamMatches extends Component {
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

    try {
      const teamAndMatchesDataAPIResponse = await fetch(teamMatchesApiUrl)
      const fetchedTeamAndMatchesData =
        await teamAndMatchesDataAPIResponse.json()

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
    } catch (error) {
      console.error('Error fetching team matches data:', error)
      this.setState({isLoading: false}) // Set loading to false if there's an error to avoid blocking the UI
    }
  }

  // Function to render the Pie chart with Legends
  renderPieChart = () => {
    const {teamAndMatchesData} = this.state
    const {recentMatches} = teamAndMatchesData
    const pieChartData = recentMatches.map(match => ({
      name: match.competingTeam,
      value: match.result === 'Win' ? 1 : 0,
    }))

    return (
      <PieChart width={400} height={400}>
        <Pie
          data={pieChartData}
          cx={200}
          cy={200}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {pieChartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend /> {/* Adding Legends to the Pie chart */}
      </PieChart>
    )
  }

  // Function to handle back button click to navigate to Home Route
  handleBackButtonClick = () => {
    const {history} = this.props
    history.push('/')
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
            {this.renderPieChart()} {/* Render Pie chart with Legends */}
            <button
              onClick={this.handleBackButtonClick}
              className="back-button"
            >
              Back
            </button>{' '}
            {/* Adding Back button */}
            <div className="competing-teams">
              {recentMatches.map(recentMatchDataItem => (
                <p key={recentMatchDataItem.id}>
                  {recentMatchDataItem.competingTeam}
                </p> // Adding paragraph elements with competing team names
              ))}
            </div>
          </>
        )}
      </div>
    )
  }
}

export default withRouter(TeamMatches)
