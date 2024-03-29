import { MyProfileInterface } from "../reducers/userReducer";
import { AppDispatch, RootState } from "../store";
export const LOG_IN = "LOG_IN";
export const SUCCESSFULLY_LOGGED_IN = "SUCCESSFULLY_LOGGED_IN";
export const GET_MY_PROFILE = "GET_MY_PROFILE";
export const EDIT_INFO = "EDIT_INFO";
export const EDIT_PHOTO = "EDIT_PHOTO";
export const ADD_NEW_RECENT_MOVIE = "ADD_NEW_RECENT_MOVIE";
export const EDIT_COVER = "EDIT_COVER";
export const SUCCESSFULLY_LOGGED_OUT = "SUCCESSFULLY_LOGGED_OUT";
export const EDIT_REDUX_STATE_ON_LOGOUT = "EDIT_REDUX_STATE_ON_LOGOUT";
export const ADD_NEW_MOVIE_TO_DICOVER_PAGE = "ADD_NEW_MOVIE_TO_DICOVER_PAGE";

export interface IRecentlyAdded {
  imdbId: string;
  poster: string;
}

export const successfullyLoggedInAction = (value: boolean) => {
  return {
    type: SUCCESSFULLY_LOGGED_IN,
    payload: value,
  };
};

export const getMyProfileAction = () => {
  return async (dispatch: AppDispatch, getState: any) => {
    // console.log("trying to fetch my profile info");
    const beUrl = process.env.REACT_APP_BE_URL;
    const options: RequestInit = {
      method: "GET",
      credentials: "include",
    };
    try {
      const response = await fetch(`${beUrl}/users/me/profile`, options);
      // console.log("response: ", response);
      if (response.ok) {
        // console.log("merge");
        let myData = await response.json();
        // console.log("my data: ", myData);
        dispatch({
          type: GET_MY_PROFILE,
          payload: myData,
        });
      } else {
        console.log("error while trying to fetch my profile data");
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const editProfileInfoAction = (newData: MyProfileInterface) => {
  return {
    type: EDIT_INFO,
    payload: newData,
  };
};

export const editProfilePhotoAction = (newData: MyProfileInterface) => {
  return {
    type: EDIT_PHOTO,
    payload: newData,
  };
};

export const editProfileCoverAction = (newData: MyProfileInterface) => {
  return {
    type: EDIT_COVER,
    payload: newData,
  };
};

// { imdbId: string, poster: string }
export const addNewRecentMovieAction = ({ imdbId, poster }: IRecentlyAdded) => {
  return {
    type: ADD_NEW_RECENT_MOVIE,
    payload: { imdbId: imdbId, poster: poster },
  };
};

export const successfullyLoggedOutAction = (value: boolean) => {
  return {
    type: SUCCESSFULLY_LOGGED_OUT,
    payload: value,
  };
};

export const editReduxStateOnLogoutAction = () => {
  return {
    type: EDIT_REDUX_STATE_ON_LOGOUT,
  };
};

export const addNewMovieToDiscoverPageAction = (filteredMovies: any) => {
  return {
    type: ADD_NEW_MOVIE_TO_DICOVER_PAGE,
    payload: filteredMovies,
  };
};
