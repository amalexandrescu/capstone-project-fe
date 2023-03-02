// import { Middleware } from "redux";
import { LogInUserInfoInterface } from "../../components/login/LogIn";
import { AppDispatch, RootState } from "../store";
export const LOG_IN = "LOG_IN";
export const SUCCESSFULLY_LOGGED_IN = "SUCCESSFULLY_LOGGED_IN";

export const successfullyLoggedInAction = () => {
  return {
    type: SUCCESSFULLY_LOGGED_IN,
    payload: true,
  };
};

export const logInAction = (userCredentials: LogInUserInfoInterface) => {
  return async (dispatch: AppDispatch, getState: any) => {
    const currentState = getState();
    console.log(currentState);
    console.log("trying to log in");
    const beUrl = process.env.REACT_APP_BE_URL;

    const options = {
      method: "POST",
      body: JSON.stringify(userCredentials),
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      let response = await fetch(`${beUrl}/users/login`, options);
      if (response.ok) {
        let fetchedData = await response.json();
        dispatch({
          type: LOG_IN,
          payload: fetchedData,
        });
      } else {
        console.log("error");
      }
    } catch (error) {
      console.log(error);
    }
  };
};
