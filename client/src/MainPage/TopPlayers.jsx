import React from 'react';
import './main_page.css'
import { userService } from '../_services';
import { connect } from 'react-redux';
import { userActions } from '../_actions';



class PlayersList extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
      const zip = (...rows) => [...rows[0]].map((_, c) => rows.map(row => row[c]));
        const user_winrate = zip(this.props.users, this.props.winrate);
        console.log(user_winrate);
        const rows = user_winrate.map(user =>
            <tr>
                <td>{user[0]}</td>
                <td>{user[1]}</td>
            </tr>
        );
        return (
            <table id='usernames'>
                <tbody>
                    <tr className='thead'>
                        <th>Username</th>
                        <th>Win rate</th>
                    </tr>
                    {rows}
                </tbody>
            </table>
        )
    }
}

class TopPlayers extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.get_top_players();
    }

    render() {
        return (
            <div>
                {this.props.requesting_top_10 &&
                    <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                }
                {this.props.received_top_10 &&
                    <h2>
                        Best players
                    </h2>
                }
                {this.props.received_top_10 &&
                    <PlayersList users={this.props.users} winrate={this.props.winrate} />
                }
            </div>

        );
    }
}

function mapState(state) {
    return { requesting_top_10: state.users.requesting_top_10,
             received_top_10: state.users.received_top_10,
             users: state.users.users,
             winrate: state.users.winrate
              };
}

const actionCreators = {
    get_top_players: userActions.getTopPlayers,
};

const connectedTopPlayers = connect(mapState, actionCreators)(TopPlayers);
export { connectedTopPlayers as TopPlayers };

