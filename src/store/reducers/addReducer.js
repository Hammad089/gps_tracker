import { ADD_COUNT } from "../type";

const initialState = {
    count: 0
};

export const AddReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_COUNT:
            return {
                ...state,
                count: state.count + 1
            };
        default:
            return state;
    }
};
