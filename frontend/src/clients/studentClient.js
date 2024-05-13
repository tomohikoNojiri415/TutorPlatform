import fetch from "unfetch";
import { checkStatus, getTokenFromLocalStorage } from "../utils/util";
import { objectToQueryString } from "../utils/util";

export const updateStudentInfo = (studentId, studentInfo) =>
  fetch(`/api/student/profile/${studentId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getTokenFromLocalStorage(),
    },
    method: "POST",
    body: JSON.stringify(studentInfo),
  }).then(checkStatus);

export const getStudentInfoById = (studentId) =>
  fetch(`/api/student/profile/${studentId}`, {
    headers: {
      Authorization: "Bearer " + getTokenFromLocalStorage(),
    },
    method: "GET",
  }).then(checkStatus);

export const getAllStudents = () =>
  fetch("/api/admin/students", {
    headers: {
      Authorization: "Bearer " + getTokenFromLocalStorage(),
    },
    method: "GET",
  }).then(checkStatus);

export const studentSignUp = (authPayload) =>
  fetch("/auth/student/sign_up", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(authPayload),
  }).then(checkStatus);

export const filterTutors = (filters) =>
  fetch(`/api/user/satisfiedTutors${objectToQueryString(filters)}`, {
    headers: {
      Authorization: "Bearer " + getTokenFromLocalStorage(),
    },
    methos: "GET",
  }).then(checkStatus);

export const bookAnAppointment = (payload) =>
  fetch("/api/appointment", {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getTokenFromLocalStorage(),
    },
    method: "POST",
    body: JSON.stringify(payload),
  }).then(checkStatus);

export const getStudent = (studentId) =>
  fetch(`/api/student/${studentId}`, {
    headers: {
      Authorization: "Bearer " + getTokenFromLocalStorage(),
    },
    method: "GET",
  }).then(checkStatus);

export const getStudentContacts = (studentId) =>
  fetch(`/api/student/contacts/${studentId}`, {
    headers: {
      Authorization: "Bearer " + getTokenFromLocalStorage(),
    },
    method: "GET",
  }).then(checkStatus);
