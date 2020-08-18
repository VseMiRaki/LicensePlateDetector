import React from 'react';
import { connect } from 'react-redux';
import { userActions } from '../_actions';

class GamesList extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const zip = (...rows) => [...rows[0]].map((_, c) => rows.map(row => row[c]));
        const games = zip(this.props.winners, this.props.losers);
        const rows = games.map(game =>
            <tr>
                {check(this.props.username, game[0], true)}
                {check(this.props.username, game[1], false)}
            </tr>
        );
        return (
            <table id='usernames'>
                <tbody>
                    <tr>
                        <th>Winner</th>
                        <th>Loser</th>
                    </tr>
                    {rows}
                </tbody>
            </table>
        )
    }
}

function check(username, current_username, result) {
    if (username === current_username && result) {
        return (
            <td className='winner'>
                {current_username}
            </td>
        );
    }
    if (username === current_username && !result) {
        return (
            <td className='loser'>
                {current_username}
            </td>
        );
    } 
    return (
        <td className='standart'>
            {current_username}
        </td>
    );
}

class Stats extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.get_player_stats(this.props.token);
    }

    render() {
        return (
            <div>
                {this.props.requesting_stats &&
                    <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                }
                {this.props.received_stats &&
                    <h2>
                        Winrate: {this.props.winrate}%
                    </h2>
                }
                {this.props.received_stats &&
                    <h2>
                        Your last games
                    </h2>
                }
                {this.props.received_stats &&
                    <GamesList winners={this.props.winners} losers={this.props.losers} username={this.props.username}/>
                }
            </div>

        );
    }
}

function mapState(state) {
    let user = JSON.parse(localStorage.getItem('user'));


    return {
        requesting_stats: state.user_stats.requesting_stats,
        received_stats: state.user_stats.received_stats,
        winners: state.user_stats.winners,
        losers: state.user_stats.losers,
        winrate: state.user_stats.winrate,
        token: user.token,
        username: user.username
    };
}

const actionCreators = {
    get_player_stats: userActions.getPlayerStats,
};

const connectedStats = connect(mapState, actionCreators)(Stats);
export { connectedStats as Stats };