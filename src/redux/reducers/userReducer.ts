import { LOG_IN, SUCCESSFULLY_LOGGED_IN } from "../actions";

interface UserState {
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  successfullyLoggedIn: boolean;
}

const initialState: UserState = {
  firstName: "",
  lastName: "",
  email: "",
  avatar: "",
  successfullyLoggedIn: false,
};

interface reduxAction {
  type: string;
  payload: any;
}

const userReducer = (state = initialState, action: reduxAction) => {
  switch (action.type) {
    case LOG_IN:
      return {
        ...state,
        user: action.payload,
      };
    case SUCCESSFULLY_LOGGED_IN:
      return {
        ...state,
        successfullyLoggedIn: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
