import "./App.css";
import "./css/Form.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/Root";
import Homepage from "./routes/Homepage";
import ProfileForm from "./routes/ProfileForm";
import ErrorPage from "./routes/Errorpage";
import FindATutor from "./routes/FindATutor";
import AppointmentsPage from "./routes/AppointmentsPage";
import AppointmentsDetail from "./routes/AppointmentsDetail";
import MessagesPage from "./routes/MessagesPage";
import AdminCourses from "./routes/AdminCourses";
import SignUpPage from "./routes/SignUpPage";
import LoginPage from "./routes/LoginPage";
import StudentsActionPage from "./routes/StudentsActionPage.js";
import ShowAllAdmins from "./routes/AdminsActionPage.js";
import TutorsActionPage from "./routes/TutorsActionPage.js";
import DelinedRequests from "./routes/DeclinedRequests.js";
import BookAnAppointment from "./routes/BookAnAppointment.js";
import CoursesPage from "./routes/CoursesPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        {
          // Make homepage the default outlet of Root
          index: true,
          element: <Homepage />,
        },
        {
          path: "/homepage",
          element: <Homepage />,
        },
        {
          path: "/profile",
          element: <ProfileForm />,
        },
        {
          path: "/find-a-tutor",
          element: <FindATutor />,
        },
        {
          path: "/appointments/booking/:tutorId",
          element: <BookAnAppointment />,
        },
        {
          path: "/appointments",
          element: <AppointmentsPage />,
        },
        {
          path: "/appointment/:id",
          element: <AppointmentsDetail />,
        },
        {
          path: "/messages",
          element: <MessagesPage />,
        },
        {
          path: "/messages/:defaultContactId",
          element: <MessagesPage />,
        },
        {
          path: "/courses",
          element: <CoursesPage />,
        },
        {
          path: "/admin/students",
          element: <StudentsActionPage />,
        },
        {
          path: "/admin/tutors",
          element: <TutorsActionPage />,
        },
        {
          path: "/admin/admins",
          element: <ShowAllAdmins />,
        },
        {
          path: "/admin/tutors/declined-requests",
          element: <DelinedRequests />,
        },
        {
            path: "/admin/courses",
            element: <AdminCourses />
        },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/sign-up",
      element: <SignUpPage />,
    },
  ]);

  return <RouterProvider router={router} />;
}
export default App;