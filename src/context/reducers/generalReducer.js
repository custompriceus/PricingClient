export const generalStates = {
  isLoggedIn: localStorage.getItem("userDetails") ? true : false,
  isBusy: false,
  user: localStorage.getItem("userDetails") ? JSON.parse(localStorage.getItem("userDetails")) : {}
}

export const generalReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isLoggedIn: true
      };
    case "LOGOUT":
      return {
        ...state,
        isLoggedIn: false
      };
    case "SETISBUSY":
      return {
        ...state,
        isBusy: true
      };
    case "RESETISBUSY":
      return {
        ...state,
        isBusy: false
      };
    case "SET_USER":
      console.log('set user, ', action.data)
      return {
        ...state,
        user: action.data
      };
    default:
      throw new Error("Unexpected action");
  }
};
