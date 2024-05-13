import { userTypes } from "../types";
import AdminUserActionTable from "../components/AdminUserActionTable";
import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import SignUpRequests from "../components/SignUpRequests";
import { v4 as uuid } from "uuid";

const TutorsActionPage = () => {
  const [setTitle] = useOutletContext();
  const [refreshKey, setRefreshKey] = useState();

  const handleTutorsListChange = () => {
    setRefreshKey(uuid());
  };

  useEffect(() => {
    setTitle("Manage Tutors");
  });

  return (
    <>
      <SignUpRequests onTutorsListChange={handleTutorsListChange} />
      <AdminUserActionTable userType={userTypes.Tutor} refeshKey={refreshKey} />
    </>
  );
};
export default TutorsActionPage;
