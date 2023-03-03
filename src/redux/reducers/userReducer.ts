import {
  LOG_IN,
  SUCCESSFULLY_LOGGED_IN,
  GET_MY_PROFILE,
  EDIT_SUCCESSFULLY,
} from "../actions";

export interface MyProfileInterface {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
}

interface UserState {
  myProfile: MyProfileInterface;
  // _id: string;
  // firstName: string;
  // lastName: string;
  // email: string;
  // avatar: string;
  successfullyLoggedIn: boolean;
  editProfileInfoSuccessfully: boolean;
}

const initialState = {
  myProfile: {
    _id: "",
    firstName: "",
    lastName: "",
    email: "",
    avatar: "",
  },
  successfullyLoggedIn: false,
  editProfileInfoSuccessfully: false,
};

interface reduxAction {
  type: string;
  payload: any;
}

const userReducer = (state = initialState, action: reduxAction) => {
  switch (action.type) {
    case SUCCESSFULLY_LOGGED_IN:
      return {
        ...state,
        successfullyLoggedIn: action.payload,
      };
    case GET_MY_PROFILE:
      return {
        ...state,
        myProfile: action.payload,
      };
    case EDIT_SUCCESSFULLY:
      return {
        ...state,
        editProfileInfoSuccessfully: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
