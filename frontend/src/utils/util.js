import { getTutor, updateTutorInfo } from "../clients/tutorClient";
import { getStudent, updateStudentInfo } from "../clients/studentClient";
import { updateAdminInfo } from "../clients/adminClient";
import { getAdmin } from "../clients/adminClient";
import { v4 as uuid } from "uuid";
import { getAllUsers } from "../clients/adminClient";
import { userTypes } from "../types";

export const getUser = async (userId, userType) => {
  switch (userType) {
    case "TUTOR":
      return getTutor(userId);
    case "STUDENT":
      return getStudent(userId);
    case "ADMIN":
      return getAdmin(userId);
    default:
      return null;
  }
};

export const updateUserInfo = (userId, userType, userPayload) => {
  if (userType === userTypes.Tutor) {
    return updateTutorInfo(userId, userPayload);
  } else if (userType === userTypes.Student) {
    return updateStudentInfo(userId, userPayload);
  } else {
    // Admin
    return updateAdminInfo(userId, userPayload);
  }
};

export const checkStatus = (response) => {
  if (response.ok) {
    return response;
  } else if (response.status === 403) {
    window.location.href = "/login";
    localStorage.removeItem("authContext");
    return response;
  }

  // convert non-2xx HTTP responses into errors:
  console.log(response);
  const error = new Error(response.statusText);
  error.response = response;
  return Promise.reject(error);
};

export const storeAuthContext = (response, userType) => {
  // get token from header
  var jwtToken = response.headers.get("Authorization");
  // Token comes with the 'Bearer ' prefix, so you might want to remove it
  if (jwtToken && jwtToken.startsWith("Bearer ")) {
    jwtToken = jwtToken.slice(7);
  } else {
    return response;
  }
  // store the token and other auth info
  response.json().then((data) => {
    localStorage.setItem(
      "authContext",
      JSON.stringify({
        id: data.id,
        userType: userType,
        token: jwtToken,
      })
    );
  });
  return response;
};

export const objectToQueryString = (params) => {
  const queryString = Object.keys(params)
    .filter((key) => {
      return params[key] !== null;
    })
    .map((key) => {
      return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
    })
    .join("&");
  if (queryString) {
    return "?" + queryString;
  }
  return "";
};

export const getAuthContext = () => {
  const authContext = localStorage.getItem("authContext");
  if (authContext == null) return null;
  return JSON.parse(authContext);
};

export const getTokenFromLocalStorage = () => {
  const authContext = getAuthContext();
  if (authContext === null || authContext.token === null) return "";
  return getAuthContext().jwtToken;
};

export const getAllUsersCombined = () => {
  return Promise.all([
    getAllUsers(userTypes.Tutor),
    getAllUsers(userTypes.Student),
    getAllUsers(userTypes.Admin),
  ])
    .then((responses) => Promise.all(responses.map((res) => res.json())))
    .then(([tutors, students, admins]) => {
      // Combine the data from all three sources
      const tutorsWithField = tutors.data.map((item) => ({
        ...item,
        userType: userTypes.Tutor,
      }));
      const studentsWithField = students.data.map((item) => ({
        ...item,
        userType: userTypes.Student,
      }));
      const adminsWithField = admins.data.map((item) => ({
        ...item,
        userType: userTypes.Admin,
      }));

      const combinedData = [
        ...tutorsWithField,
        ...studentsWithField,
        ...adminsWithField,
      ];
      // Handle the combined data
      return combinedData.map((user) => {
        return {
          key: uuid(),
          name: [user.firstName, user.lastName].join(" "),
          email: user.email,
          phone: user.phone,
          userType: user.userType,
          timeZone: user.timeZone,
        };
      });
    });
};
