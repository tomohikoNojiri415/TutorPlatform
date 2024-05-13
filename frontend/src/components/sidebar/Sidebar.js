import TutorSidebar from "./TutorSidebar";
import StudentSidebar from "./StudentSidebar";
import AdminSidebar from "./AdminSidebar.js";
import { userTypes } from "../../types";
import LoginPage from "../../routes/LoginPage";

const userToSidebar = {
  [userTypes.Tutor]: <TutorSidebar />,
  [userTypes.Student]: <StudentSidebar />,
  [userTypes.Admin]: <AdminSidebar />,
};

const Sidebar = ({ userType }) => {
  return userType === null ? <LoginPage /> : <>{userToSidebar[userType]}</>;
};

export default Sidebar;
