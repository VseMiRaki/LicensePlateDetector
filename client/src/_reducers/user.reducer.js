import { userConstants } from '../_constants';

export function userStatsReducer(state = { requesting_stats: false, received_stats: false,
                                losers: null, winners: null, winrate: 0 }, action) {
    switch (action.type) {
        case userConstants.STATS_RECEIVED:
            const { winners, losers, winrate } = action.payload;
            return { ...state, winners: winners, losers: losers, winrate: winrate, requesting_stats: false, received_stats: true };
        case userConstants.STATS_REQUEST:
            return { ...state, requesting_stats: true };
        default:
            return state
    }
}