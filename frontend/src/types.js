export const userTypes = {
  Admin: "ADMIN",
  Tutor: "TUTOR",
  Student: "STUDENT",
};

export const stringToUserType = {
  TUTOR: userTypes.Tutor,
  STUDENT: userTypes.Student,
  ADMIN: userTypes.Admin,
};

export const timeslotStatus = {
  UNCERTAIN: "UNCERTAINTY",
  UNAVAILABLE: "UNAVAILABLE",
};
