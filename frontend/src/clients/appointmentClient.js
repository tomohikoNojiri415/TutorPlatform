import fetch from "unfetch";
import {
  checkStatus,
  getTokenFromLocalStorage,
  objectToQueryString,
} from "../utils/util";

export const getAppointmentByUserTypeStatus = (
  userType,
  id,
  appointmentStatus
) => {
  const queryObject = {
    userType,
    id,
    appointmentStatus,
  };
  return fetch(`/api/user/appointment${objectToQueryString(queryObject)}`, {
    headers: {
      Authorization: "Bearer " + getTokenFromLocalStorage(),
    },
    method: "GET",
  }).then(checkStatus);
};

export const getAppointmentById = (appointmentId) =>
  fetch(`/api/appointment/${appointmentId}`, {
    headers: {
      Authorization: "Bearer " + getTokenFromLocalStorage(),
    },
    method: "GET",
  }).then(checkStatus);

export const handleAppointmentById = (appointmentId, actionType) =>
  fetch(`/api/appointment/action`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getTokenFromLocalStorage(),
    },
    method: "POST",
    body: JSON.stringify({
      actionType: actionType,
      id: appointmentId,
    }),
  }).then(checkStatus);

export const getAppoints = (userType, id) =>
  fetch(`/api/user/appointment?userType=${userType}&id=${id}`, {
    headers: {
      Authorization: "Bearer " + getTokenFromLocalStorage(),
    },
    method: "GET",
  }).then(checkStatus);

// export const activeAppointment = (payload) =>
//   fetch(`/api/appointment/action`, {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: "Bearer " + getTokenFromLocalStorage(),
//     },
//     method: "POST",
//     body: JSON.stringify(payload),
//   }).then(checkStatus);