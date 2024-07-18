import { REMOTE_CONFIG, USER_CONSENT } from "../type";

export const setremoteConfig = (data) => {
    
    return dispatch => {
        dispatch({
            type:REMOTE_CONFIG,
            payload:data
        })
    }
}

export const userConsent = value => {
    return dispatch => {
        dispatch({
            type:USER_CONSENT,
            payload:value
        })
    }
}