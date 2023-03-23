import {
  SUCCESSFULLY_LOGGED_IN,
  GET_MY_PROFILE,
  EDIT_INFO,
  EDIT_PHOTO,
  ADD_NEW_RECENT_MOVIE,
  EDIT_COVER,
  IRecentlyAdded,
  SUCCESSFULLY_LOGGED_OUT,
  EDIT_REDUX_STATE_ON_LOGOUT,
  ADD_NEW_MOVIE_TO_DICOVER_PAGE,
} from "../actions";

export interface MyProfileInterface {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string | File | null;
  cover: string | File;
}

interface UserState {
  myProfile: MyProfileInterface;
  successfullyLoggedIn: boolean;
  editProfileInfoSuccessfully: boolean;
  editProfilePhotoSuccessfully: boolean;
  recentlySearchedMovies: Array<{ imdbId: string; poster: string }>;
  successfullyLoggedOut: boolean;
  discoverPageFiltersResult: Array<any>;
}

const initialState: UserState = {
  myProfile: {
    _id: "",
    firstName: "",
    lastName: "",
    email: "",
    avatar: "",
    cover: "",
  },
  successfullyLoggedIn: false,
  editProfileInfoSuccessfully: false,
  editProfilePhotoSuccessfully: false,
  recentlySearchedMovies: [],
  successfullyLoggedOut: false,
  discoverPageFiltersResult: [],
};

interface reduxAction {
  type: string;
  payload: any;
}

const userReducer = (state = initialState, action: reduxAction) => {
  const newFunct = (payload: IRecentlyAdded) => {
    let includes = false;
    for (let i = 0; i < state.recentlySearchedMovies.length; i++) {
      if (state.recentlySearchedMovies[i].imdbId === payload.imdbId) {
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
    case EDIT_COVER:
      return {
        ...state,
        myProfile: { ...state.myProfile, cover: action.payload },
      };
    case ADD_NEW_RECENT_MOVIE:
      return {
        ...state,

        recentlySearchedMovies: [
          ...state.recentlySearchedMovies,
          action.payload,
        ],
      };
    case SUCCESSFULLY_LOGGED_OUT:
      return {
        ...state,
        successfullyLoggedOut: action.payload,
      };
    case EDIT_REDUX_STATE_ON_LOGOUT:
      return {
        ...state,
        myProfile: {
          _id: "",
          firstName: "",
          lastName: "",
          email: "",
          avatar: "",
          cover: "",
        },

        editProfileInfoSuccessfully: false,
        editProfilePhotoSuccessfully: false,
        discoverPageFiltersResult: [],
      };
    case ADD_NEW_MOVIE_TO_DICOVER_PAGE:
      return {
        ...state,
        discoverPageFiltersResult: [action.payload].flat(),
      };
    default:
      return state;
  }
};

export default userReducer;
