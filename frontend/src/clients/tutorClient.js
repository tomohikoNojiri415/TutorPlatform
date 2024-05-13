import fetch from "unfetch";
import { checkStatus, getTokenFromLocalStorage } from "../utils/util";

export const updateTutorInfo = (tutorId, tutorInfo) =>
  fetch(`/api/tutor/profile/${tutorId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getTokenFromLocalStorage(),
    },
    method: "POST",
    body: JSON.stringify(tutorInfo),
  }).then(checkStatus);

export const getTutorInfoById = (tutorId) =>
  fetch(`/api/tutor/profile/${tutorId}`, {
    headers: {
      Authorization: "Bearer " + getTokenFromLocalStorage(),
    },
    method: "GET",
  }).then(checkStatus);

export const getAllActiveTutors = () =>
  fetch("/api/tutors", {
    headers: {
      Authorization: "Bearer " + getTokenFromLocalStorage(),
    },
    method: "GET",
  }).then(checkStatus);

export const getTutorSlot = (tutorId) =>
  fetch(`/api/timetable/${tutorId}`, {
    headers: {
      Authorization: "Bearer " + getTokenFromLocalStorage(),
    },
    method: "GET",
  }).then(checkStatus);

export const getTutor = (tutorId) =>
  fetch(`/api/tutor/${tutorId}`, {
    headers: {
      Authorization: "Bearer " + getTokenFromLocalStorage(),
    },
    method: "GET",
  }).then(checkStatus);

export const getTutorContacts = (tutorId) => 
  fetch(`/api/tutor/contacts/${tutorId}`, {
    headers: { 
      'Authorization': 'Bearer ' + getTokenFromLocalStorage() 
    },
    method: 'GET',
  }).then(checkStatus);

export const updateRate = (payload) =>
  fetch("/api/rate", {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getTokenFromLocalStorage(),
    },
    method: "POST",
    body: JSON.stringify(payload),
  }).then(checkStatus);

export const getLastRate = (studentId) =>
  fetch(`/api/lastRate?studentId=${studentId}`, {
    headers: {
      'Authorization': "Bearer " + getTokenFromLocalStorage()
    },
    method: 'GET',
  }).then(checkStatus);

export const getCourseTutors = courseId =>
  fetch(`/api/tutors/course/${courseId}`, {
    headers: {
      'Authorization': "Bearer " + getTokenFromLocalStorage()
    },
    method: 'GET',
  }).then(checkStatus);
