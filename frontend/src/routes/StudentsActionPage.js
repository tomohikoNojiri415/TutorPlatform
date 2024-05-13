import { useEffect } from "react";
import { userTypes } from "../types";
import AdminUserActionTable from "../components/AdminUserActionTable";
import { useOutletContext } from "react-router-dom";
const StudentsActionPage = () => {
  const [setTitle] = useOutletContext();

  useEffect(() => {
    setTitle("Manage Students");
  });
  return <AdminUserActionTable userType={userTypes.Student} />;
};
export default StudentsActionPage;
