export const generalActions = (props) => {
  return {
    login: () => {
      props.dispatch({ type: "LOGIN" });
    },
    logout: () => {
      props.dispatch({ type: "LOGOUT" });
    },
    setisbusy: () => {
      props.dispatch({ type: "SETISBUSY" });
    },
    resetisbusy: () => {
      props.dispatch({ type: "RESETISBUSY" });
    },
    setUser: (data) => {
      externSetValue(props, data);
    },
  }
}

function externSetValue(props, data) {
  props.dispatch({ type: "SET_USER", data });
}
