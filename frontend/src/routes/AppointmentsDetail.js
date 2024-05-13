import { useEffect, useState } from "react";
import { Descriptions, Button, Badge, Breadcrumb, Spin } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { getAppointmentById } from "../clients/appointmentClient.js";
import { getStudentInfoById } from "../clients/studentClient.js";
import { getTutorInfoById } from "../clients/tutorClient.js";
import { handleAppointmentById } from "../clients/appointmentClient.js";
import {
  errorNotification,
  successNotification,
} from "../components/notifications.js";

const handleAppointmentAction = (id, actionType, navigate) => {
  handleAppointmentById(id, actionType).then(() => {
    successNotification(
      "Action Success",
      `Appointment has been ${actionType.toLowerCase()}d!`
    );
    //navigate to the appointment list page according to user type
    navigate("/appointments");
  });
};

const handleMessage = () => {};

const AppointmentsDetail = () => {
  const [appointment, setAppointment] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  const formatDateTime = (time) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    const formattedTime = new Date(time).toLocaleString(undefined, options);
    return `${formattedTime}`;
  };
  useEffect(() => {
    const fetchData = (appointmentId) => {
      getAppointmentById(appointmentId)
        .then((response) => response.json())
        .then((result) => {
          const appointmentData = result.data;
          getStudentInfoById(appointmentData.studentId)
            .then((res) => res.json())
            .then((studentData) => {
              getTutorInfoById(appointmentData.tutorId)
                .then((res) => res.json())
                .then((tutorData) => {
                  setAppointment({
                    appointmentId: appointmentData.id,
                    tutorId: appointmentData.tutorId,
                    studentId: appointmentData.studentId,
                    timeStart: new Date(appointmentData.timeStart),
                    timeEnd: new Date(appointmentData.timeEnd),
                    status: appointmentData.status,
                    course: appointmentData.course,
                    tutorFirstName: tutorData.data.firstName,
                    tutorLastName: tutorData.data.lastName,
                    studentFirstName: studentData.data.firstName,
                    studentLastName: studentData.data.lastName,
                  });
                });
            });
        })
        .catch((err) => {
          err.response.json().then((res) => {
            errorNotification("Failed to view Appointment", res.message);
            navigate("/appointments");
          });
        });
    };
    fetchData(id);
  }, [id, navigate]);
  return (
    <>
      <Breadcrumb
        items={[
          { title: <a href="/">Home</a> },
          { title: <a href="/appointments">Appointments List</a> },
        ]}
      />
      {appointment ? (
        <div>
          <Descriptions title="Appointment Details">
            <Descriptions.Item label="Tutor Name" style={{ display: "block" }}>
              {appointment.tutorFirstName} {appointment.tutorLastName}
            </Descriptions.Item>
            <Descriptions.Item
              label="Student Name"
              style={{ display: "block" }}
            >
              {appointment.studentFirstName} {appointment.studentLastName}
            </Descriptions.Item>
            <Descriptions.Item label="Course" style={{ display: "block" }}>
              {appointment.course}
            </Descriptions.Item>
            <Descriptions.Item label="Time Start" style={{ display: "block" }}>
              {formatDateTime(appointment.timeStart)}
            </Descriptions.Item>
            <Descriptions.Item label="Time Finish" style={{ display: "block" }}>
              {formatDateTime(appointment.timeEnd)}
            </Descriptions.Item>
            <Descriptions.Item label="Status" style={{ display: "block" }}>
              <Badge
                status={
                  appointment.status === "CONFIRMED" ||
                  appointment.status === "COMPLETED"
                    ? "success"
                    : appointment.status === "PENDING"
                    ? "processing"
                    : "error"
                }
                text={appointment.status}
              />
            </Descriptions.Item>
          </Descriptions>

          <div>
            {appointment.status === "PENDING" && (
              <>
                <Button
                  type="primary"
                  onClick={() =>
                    handleAppointmentAction(
                      appointment.appointmentId,
                      "APPROVE",
                      navigate
                    )
                  }
                >
                  Approve
                </Button>
                <Button
                  type="danger"
                  onClick={() =>
                    handleAppointmentAction(
                      appointment.appointmentId,
                      "DECLINE",
                      navigate
                    )
                  }
                >
                  Decline
                </Button>
              </>
            )}
            {appointment.status !== "COMPLETED" && (
              <Button onClick={handleMessage}>Message</Button>
            )}
          </div>
        </div>
      ) : (
        <Spin tip="Loading" size="large">
          <div className="content" />
        </Spin>
      )}
    </>
  );
};

export default AppointmentsDetail;
