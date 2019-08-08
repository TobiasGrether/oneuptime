import {
    FETCH_USERS_REQUEST,
    FETCH_USERS_SUCCESS,
    FETCH_USERS_FAILURE,
    FETCH_USERS_RESET,

    UPDATE_USER_SETTING_REQUEST,
    UPDATE_USER_SETTING_SUCCESS,
    UPDATE_USER_SETTING_FAILURE,
    UPDATE_USER_SETTING_RESET,
} from '../constants/user';

const INITIAL_STATE = {
    users: {
        error: null,
        requesting: false,
        success: false,
        users: [],
        count: null,
        limit: null,
        skip: null
    },
    userSetting: {
        error: null,
        requesting: false,
        success: false,
        data: {}
    },
};

export default function user(state = INITIAL_STATE, action) {

    switch (action.type) {

        // fetch users list
        case FETCH_USERS_REQUEST:

            return Object.assign({}, state, {
                users: {
                    requesting: true,
                    error: null,
                    success: false,
                },

            });

        case FETCH_USERS_SUCCESS:
            return Object.assign({}, state, {
                users: {
                    requesting: false,
                    error: null,
                    success: true,
                    users: action.payload.data,
                    count: action.payload.count,
                    limit: action.payload.limit,
                    skip: action.payload.skip
                },
            });

        case FETCH_USERS_FAILURE:

            return Object.assign({}, state, {
                users: {
                    requesting: false,
                    error: action.payload,
                    success: false,
                },
            });

        case FETCH_USERS_RESET:

            return Object.assign({}, state, {
                ...INITIAL_STATE
            });


        //update user setting
        case UPDATE_USER_SETTING_REQUEST:

            return Object.assign({}, state, {
                userSetting: {
                    requesting: true,
                    error: null,
                    success: false,
                },

            });

        case UPDATE_USER_SETTING_SUCCESS:
            return Object.assign({}, state, {
                userSetting: {
                    requesting: false,
                    error: null,
                    success: true,
                    data: action.payload
                },
                users: {
                    requesting: false,
                    error: null,
                    success: true,
                    users: state.users.users.map(user => user._id === action.payload._id ? action.payload : user),
                    count: action.payload.count,
                    limit: action.payload.limit,
                    skip: action.payload.skip
                }
            });

        case UPDATE_USER_SETTING_FAILURE:

            return Object.assign({}, state, {
                userSetting: {
                    requesting: false,
                    error: action.payload,
                    success: false,
                },
            });

        case UPDATE_USER_SETTING_RESET:

            return Object.assign({}, state, {
                ...INITIAL_STATE
            });

        default: return state;
    }
}
