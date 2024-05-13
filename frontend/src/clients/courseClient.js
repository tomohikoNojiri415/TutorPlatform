import fetch from 'unfetch';
import { getTokenFromLocalStorage, checkStatus } from '../utils/util';


export const getAllCourses = () => 
    fetch(`/api/courses`, {
        headers: {
            'Authorization': 'Bearer ' + getTokenFromLocalStorage()
        },
        method: 'GET'
    }).then(checkStatus);

export const getACourse = id =>
    fetch(`/api/course/${id}`, {
        headers: {
            'Authorization': 'Bearer ' + getTokenFromLocalStorage()
        },
        method: 'GET'
    }).then(checkStatus)

export const getAllCourseNames = () =>
  fetch("/api/courses/name", {
    headers: {
      Authorization: "Bearer " + getTokenFromLocalStorage(),
    },
    method: "GET",
  }).then(checkStatus);
