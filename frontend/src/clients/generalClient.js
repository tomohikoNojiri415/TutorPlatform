import fetch from "unfetch";
import { checkStatus, getTokenFromLocalStorage } from "../utils/util";

export const getAllTimeZones = () =>
  fetch("/api/timezone", {
    headers: {
      Authorization: "Bearer " + getTokenFromLocalStorage(),
    },
    method: "GET",
  }).then(checkStatus);
