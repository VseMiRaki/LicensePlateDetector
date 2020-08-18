import { userConstants } from '../_constants';

export function users(state = { requesting_top_10: false, received_top_10: false}, action) {
    switch (action.type) {
        case userConstants.TOP10_REQUEST:
            return { ...state, requesting_top_10: true };
        case userConstants.TOP10_RECEIVED:
            const { users, winrate } = action.payload;
            return { ...state, users: users, winrate: winrate, received_top_10: true, requesting_top_10: false };
        default:
            return state
    }
}