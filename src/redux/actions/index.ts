// import { Middleware } from "redux";
// import { LogInUserInfoInterface } from "../../components/login/LogIn";
import { UserInfo } from "os";
import { MyProfileInterface } from "../reducers/userReducer";
import { AppDispatch, RootState } from "../store";
export const LOG_IN = "LOG_IN";
export const SUCCESSFULLY_LOGGED_IN = "SUCCESSFULLY_LOGGED_IN";
export const GET_MY_PROFILE = "GET_MY_PROFILE";
export const EDIT_INFO = "EDIT_INFO";
export const EDIT_PHOTO = "EDIT_PHOTO";
export const ADD_NEW_RECENT_MOVIE = "ADD_NEW_RECENT_MOVIE";

export const successfullyLoggedInAction = () => {
  return {
    type: SUCCESSFULLY_LOGGED_IN,
    payload: true,
  };
};

export const getMyProfileAction = () => {
  return async (dispatch: AppDispatch, getState: any) => {
    console.log("trying to fetch my profile info");
    const beUrl = process.env.REACT_APP_BE_URL;
    const options: RequestInit = {
      method: "GET",
      credentials: "include",
    };
    try {
      const response = await fetch(`${beUrl}/users/me/profile`, options);
      console.log("response: ", response);
      if (response.ok) {
        console.log("merge");
        let myData = await response.json();
        console.log("my data: ", myData);
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

export const addNewRecentMovieAction = (imdbId: string) => {
  return {
    type: ADD_NEW_RECENT_MOVIE,
    payload: imdbId,
  };
};

// export const logInAction = (userCredentials: LogInUserInfoInterface) => {
//   return async (dispatch: AppDispatch, getState: any) => {
//     const currentState = getState();
//     console.log(currentState);
//     console.log("trying to log in");
//     const beUrl = process.env.REACT_APP_BE_URL;

//     const options = {
//       method: "POST",
//       body: JSON.stringify(userCredentials),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     };
//     try {
//       let response = await fetch(`${beUrl}/users/login`, options);
//       if (response.ok) {
//         let fetchedData = await response.json();
//         dispatch({
//           type: LOG_IN,
//           payload: fetchedData,
//         });
//       } else {
//         console.log("error");
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };
// };
