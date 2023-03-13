import {
  SUCCESSFULLY_LOGGED_IN,
  GET_MY_PROFILE,
  EDIT_INFO,
  EDIT_PHOTO,
  ADD_NEW_RECENT_MOVIE,
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
  successfullyLoggedIn: boolean;
  editProfileInfoSuccessfully: boolean;
  editProfilePhotoSuccessfully: boolean;
  recentlySearchedMovies: string[];
}

const initialState: UserState = {
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
  recentlySearchedMovies: [],
};

interface reduxAction {
  type: string;
  payload: any;
}

const userReducer = (state = initialState, action: reduxAction) => {
  const newFunct = (payload: any) => {
    let includes = false;
    for (let i = 0; i < state.recentlySearchedMovies.length; i++) {
      if (state.recentlySearchedMovies[i] === payload) {
        includes = true;
        break;
      }
    }
    return includes;
  };

  if (action.type === ADD_NEW_RECENT_MOVIE && newFunct(action.payload))
    return state;

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
    case ADD_NEW_RECENT_MOVIE:
      return {
        ...state,
        recentlySearchedMovies: [
          ...state.recentlySearchedMovies,
          action.payload,
        ],
      };
    default:
      return state;
  }
};

export default userReducer;
