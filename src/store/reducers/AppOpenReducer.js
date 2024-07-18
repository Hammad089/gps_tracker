import { SET_APP_OPEN_STATUS } from "../type";
const initialState = {
    isAppOpenedBefore:false,
    isKeyboardOpen:false
};

const appStatusReducer = (state = initialState,action) => {
    switch (action.type) {
        case SET_APP_OPEN_STATUS:
            return {
                ...state,
                isAppOpenedBefore: action.payload,
            };
        case "SET_KEYBAORD_OPEN":
            return{
                ...state,
                isKeyboardOpen:action.payload
            }
        default:
            return state;
        }
    }

    export default appStatusReducer
