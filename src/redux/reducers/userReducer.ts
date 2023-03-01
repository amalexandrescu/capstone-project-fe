const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  avatar: "",
};

interface reduxAction {
  type: string;
  payload: any;
}

const userReducer = (state = initialState, action: reduxAction) => {
  switch (action.type) {
    // case SET_USERNAME:
    //   return {
    //     ...state,
    //     name: action.payload, // this is the new username, just set
    //   };

    default:
      return state;
  }
};

export default userReducer;
