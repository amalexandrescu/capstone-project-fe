import {
  LOG_IN,
  SUCCESSFULLY_LOGGED_IN,
  GET_MY_PROFILE,
  EDIT_INFO,
  EDIT_PHOTO,
} from "../actions";

export interface MyProfileInterface {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string | File | null;
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
  editProfilePhotoSuccessfully: boolean;
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
  editProfilePhotoSuccessfully: false,
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
    case EDIT_INFO:
      return {
        ...state,
        myProfile: {
          ...state.myProfile,
          ...action.payload,
        },
      };
    case EDIT_PHOTO:
      return {
        ...state,
        myProfile: { ...state.myProfile, avatar: action.payload },
      };
    default:
      return state;
  }
};

export default userReducer;
