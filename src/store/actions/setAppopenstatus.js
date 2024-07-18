import { SET_APP_OPEN_STATUS } from "../type";
export const setAppOpenedStatus = status => ({
    type: SET_APP_OPEN_STATUS,
    payload: status,
  });


  export const setIsKeyboardOpen = status => ({
    type: "SET_KEYBAORD_OPEN",
    payload: status,
  });