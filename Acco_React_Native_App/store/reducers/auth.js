import { LOGIN, SIGNUP, LOGOUT } from "../actions/auth";
//import { AUTHENTICATE } from "../actions/auth";
const initialState = {
    token: null,
    userId: null,
    userEmail: null,
    userType: null,
    useraction: null
};

export default (state = initialState, action) => {
    switch(action.type) {
        case LOGIN: 
            return {
                token: action.token,
                userId: action.userId,
                userType: action.userType,
                useraction: action.useraction,
                userEmail: action.userEmail
        };
        case SIGNUP:
            return {
                token: action.token,
                userId: action.userId,
                userType: action.userType,
                userEmail: action.userEmail
        };
        case LOGOUT:
            return initialState;
        default: 
            return state;
    }
};