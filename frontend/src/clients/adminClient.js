import fetch from 'unfetch';
import { checkStatus } from '../utils/util.js';
import { getTokenFromLocalStorage } from '../utils/util.js';

export const getAdmin = (adminId) =>
  fetch(`/api/admin/${adminId}`, {
    headers: {
      Authorization: "Bearer " + getTokenFromLocalStorage(),
    },
    method: "GET",
  }).then(checkStatus);

export const updateAdminInfo = (adminId, adminInfo) => {
  return fetch(`/api/admin/profile/${adminId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getTokenFromLocalStorage(),
    },
    method: "POST",
    body: JSON.stringify(adminInfo),
  }).then(checkStatus);
};

export const getAllUsers = (userType) =>
  fetch(`/api/admin/${userType.toLowerCase()}s`, {
    headers: {
      Authorization: "Bearer " + getTokenFromLocalStorage(),
    },
    method: "GET",
  }).then(checkStatus);

export const addNewAdmin = (admin) =>
  fetch("/api/admin/add", {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getTokenFromLocalStorage(),
    },
    method: "POST",
    body: JSON.stringify(admin),
  }).then(checkStatus);

export const deleteAdmin = (adminId) =>
  fetch(`/api/admin/delete/${adminId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getTokenFromLocalStorage(),
    },
    method: "POST",
  }).then(checkStatus);

export const invertActiveStatus = (userType, id) =>
  fetch(`/api/admin/${userType.toLowerCase()}s/active-invert/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getTokenFromLocalStorage(),
    },
    method: "POST",
  }).then(checkStatus);

export const getAllPendingTutorSignUpRequests = () =>
  fetch(`/api/admin/tutors/sign-up-requests`, {
    headers: {
      Authorization: "Bearer " + getTokenFromLocalStorage(),
    },
    method: "GET",
  }).then(checkStatus);

export const getAllDeclinedTutorSignUpRequests = () =>
  fetch(`/api/admin/tutors/sign-up-requests/declined`, {
    headers: {
      Authorization: "Bearer " + getTokenFromLocalStorage(),
    },
    method: "GET",
  }).then(checkStatus);

export const createCourse = payload =>
    fetch(`/api/admin/createCourse`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getTokenFromLocalStorage()
        },
        method: 'POST',
        body: JSON.stringify(payload),
    }).then(checkStatus);

export const updateCourse = (id, payload) =>
    fetch(`/api/admin/updateCourse/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getTokenFromLocalStorage()
        },
        method: 'POST',
        body: JSON.stringify(payload),
    }).then(checkStatus);

export const deleteCourse = id =>
    fetch(`/api/admin/deleteCourse/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getTokenFromLocalStorage()
        },
        method: 'GET',
    }).then(checkStatus);
export const approveTutorSignUpRequest = (tutorId) =>
  fetch(`/api/admin/tutors/approve/${tutorId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getTokenFromLocalStorage(),
    },
    method: "POST",
  }).then(checkStatus);

export const declineTutorSignUpRequest = (tutorId) =>
  fetch(`/api/admin/tutors/decline/${tutorId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getTokenFromLocalStorage(),
    },
    method: "POST",
  }).then(checkStatus);
