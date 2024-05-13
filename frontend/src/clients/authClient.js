import {
  checkStatus,
  storeAuthContext,
  getTokenFromLocalStorage,
} from "../utils/util";

export const login = (loginPayload) =>
  fetch("/api/auth/login", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(loginPayload),
  })
    .then(checkStatus)
    .then(storeAuthContext);

export const signUp = (authPayload) =>
  fetch("/api/auth/sign-up", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(authPayload),
  }).then(checkStatus);


export const logout = () => 
  fetch('/logout', {
    headers: {
      Authorization: "Bearer " + getTokenFromLocalStorage(),
      "Access-Control-Allow-Origin": "*",
    },
  })
    .then(checkStatus)
    .then(() => {
      window.location.href = "/login";
      localStorage.removeItem("authContext");
    });
