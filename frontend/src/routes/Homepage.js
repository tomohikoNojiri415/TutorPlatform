import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import StudentHomepage from "../components/homepage/StudentHomepage";
import TutorHomepage from "../components/homepage/TutorHomepage";
import AdminHomepage from "../components/homepage/AdminHomepage";
import { getAuthContext } from "../utils/util";
import FindATutor from "./FindATutor";
import CoursesPage from "./CoursesPage";
import AppointmentsPage from "./AppointmentsPage";

const Homepage = () => {
  const [setTitle] = useOutletContext();

  const [authContext] = useState(getAuthContext());

  const renderHomepage = () => {
    if (
      authContext === null ||
      authContext.id === null ||
      authContext.userType === null
    ) {
      window.location.href = "/login";
      return;
    }

    switch (authContext.userType) {
      case "TUTOR":
        return <AppointmentsPage />;
      case "STUDENT":
        // Assuming you've fetched the student's name and stored it
        return <CoursesPage/>;
      case "ADMIN":
        return <AdminHomepage />;
      default:
        return <div>Welcome to the platform!</div>;
    }
  };

  return renderHomepage();
};

export default Homepage;
