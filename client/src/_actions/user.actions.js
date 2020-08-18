import { userConstants } from '../_constants';
import { userService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';
import { users } from '../_reducers/users.reducer';

export const userActions = {
    login,
    logout,
    register,
    getTopPlayers,
    getPlayerStats
};

function login(username, password) {
    return dispatch => {
        dispatch(request({ username }));

        userService.login(username, password)
            .then(
                user => {
                    dispatch(success(user));
                    history.push('/');
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout() {
    userService.logout();
    return { type: userConstants.LOGOUT };
}

function register(user) {
    return dispatch => {
        dispatch(request(user));

        userService.register(user)
            .then(
                user => {
                    dispatch(success());
                    history.push('/login');
                    dispatch(alertActions.success('Registration successful'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) { return { type: userConstants.REGISTER_REQUEST, user } }
    function success(user) { return { type: userConstants.REGISTER_SUCCESS, user } }
    function failure(error) { return { type: userConstants.REGISTER_FAILURE, error } }
} 

function getTopPlayers() {
    return dispatch => {
        dispatch(request());
        console.log("I am in getTopPlayers");
        userService.get_top_players(dispatch);
    };
    function request() {
        return { type: userConstants.TOP10_REQUEST };
    };
 
}

function getPlayerStats(token) {
    return dispatch => {
        dispatch(request());
        userService.get_player_stats(dispatch, token);
    };
    function request() {
        return { type: userConstants.STATS_REQUEST };
    };

}

