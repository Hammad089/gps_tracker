import { ADD_COUNT } from "../type";
export const AddCountAction = () => {
    return dispatch => {
        dispatch({
            type: ADD_COUNT,
            payload: null
        });
    };
};