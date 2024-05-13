import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Layout, theme, Tabs, Spin } from "antd";

import "../App.css";
import {
  LoadingOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import AppointmentList from "./AppointmentList";
import RequestAppointment from "./RequestAppointment.js";
import GroupList from "./GroupList";
import GroupListTutor from "./GroupListTutor.js";
import { getAppoints } from "../clients/appointmentClient.js";
import { errorNotification, successNotification } from "../components/notifications";
import dayjs from "dayjs";
import { userTypes } from "../types.js";

// const sampledata = [
//   {
//       startTime: '2023-11-08 10:30',
//       endTime: '2023-11-08 12:00',
//       course: 'COMP3900',
//       firstName: 'tom',
//       lastName: 'tang',
//       tutorId: '1234',
//       status: 'CONFIRMED',
//       score: '3.5'
//   },
//   {
//       startTime: '2023-11-10 14:30',
//       endTime: '2023-11-10 15:30',
//       course: 'COMP9900',
//       firstName: 'frank',
//       lastName: 'cui',
//       tutorId: '1235',
//       status: 'CONFIRMED'
//   },
//   {
//       startTime: '2023-11-14 10:30',
//       endTime: '2023-11-14 12:00',
//       course: 'COMP3900',
//       firstName: 'tom',
//       lastName: 'tang',
//       tutorId: '1234',
//       status: 'PENDING'
//   },
//   {
//       startTime: '2023-11-14 14:30',
//       endTime: '2023-11-14 15:30',
//       course: 'COMP9900',
//       firstName: 'frank',
//       lastName: 'cui',
//       tutorId: '1235',
//       status: 'CONFIRMED'
//   },
//   {
//       startTime: '2023-11-11 14:30',
//       endTime: '2023-11-11 15:30',
//       course: 'COMP9900',
//       firstName: 'tu',
//       lastName: 'two',
//       tutorId: '1235',
//       status: 'CONFIRMED'
//   }
// ];

const AppointmentsPage = () => {
  const [setTitle, authContext] = useOutletContext();
  const [userType] = useState(authContext.userType);
  const [studentId, setStudentId] = useState('');
  const [tutorId, setTutorId] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [fetching, setFetching] = useState(false);

  // const { Header, Content } = Layout;
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  const fetchAppointment = (userType, id) =>
    getAppoints(userType, id)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetching all appointments")

        data.data.map((e) => {
          e.courseName = e.course.courseName;
        });
        setAppointments(data.data);
        if (userType === userTypes.Student) {
          console.log(data.data.filter(
            (x) =>
              dayjs(x.timeStart) - dayjs() > 0 &&
              (x.status === "CONFIRMED" || x.status === "PENDING")
            ))
          setDataList(
            data.data.filter(
              (x) =>
                dayjs(x.timeStart) - dayjs() > 0 &&
                (x.status === "CONFIRMED" || x.status === "PENDING")
            )
          );
        } else {
          console.log(data.data.filter((x) => x.status === "PENDING"))
          setDataList(data.data.filter((x) => x.status === "PENDING"));
        }
      })
      .catch((err) => {
        console.log(err);
        err.response.json().then((res) => {
          errorNotification(
            "There was an issue",
            `${res.message} [${res.status}] [${res.error}]`
          );
        });
      })
      .finally(() => setFetching(false));

  useEffect(() => {
    if (authContext.userType === userTypes.Student) {
      setStudentId(authContext.id);
    } else {
      setTutorId(authContext.id);
    }
      setTitle("Appointments");
    console.log("component is mounted");
    console.log(authContext);
    setFetching(true);
    fetchAppointment(userType, authContext.id);
    // sampledata test
    // sampledata.map(e => {
    //     e.tutorName = e.firstName + ' ' + e.lastName;
    // });
    // setStudentAppointment(sampledata);
    // setDataList(studentAppointment.filter(x => (dayjs(x.startTime) - dayjs() > 0) && (x.status === 'CONFIRMED' || x.status === 'PENDING')));
    // setFetching(false);
  }, []);

  const getGroupData = (userType, data) => {
    // data.prototype.groupBy(({ tutorName }) => tutorName);
    const groupedBy = {};

    for (const item of data) {
      if (userType === userTypes.Student) {
        if (groupedBy[item.tutorName]) {
          groupedBy[item.tutorName].push(item);
        } else {
          groupedBy[item.tutorName] = [item];
        }
      } else {
        if (groupedBy[item.studentName]) {
          groupedBy[item.studentName].push(item);
        } else {
          groupedBy[item.studentName] = [item];
        }
      }
    }
    console.log(groupedBy);
    setGroupData(groupedBy);
  };

  const handleTabChange = (key) => {
    if (key === "Confirmed") {
      getGroupData(userType,
        appointments.filter(
          (x) => dayjs(x.timeStart) - dayjs() > 0 && x.status === "CONFIRMED"
        )
      );
    } else if (key === "Historical") {
      getGroupData(userType,
        appointments.filter(
          (x) => dayjs(x.timeEnd) - dayjs() < 0 && x.status === "CONFIRMED"
        )
      );
    }
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const tabListStudent = [
    {
      key: "Upcoming",
      label: "Upcoming",
      children: <AppointmentList studentId={studentId} data={dataList} />,
    },
    {
      key: "Confirmed",
      label: "Confirmed",
      children: (
        <GroupList
          studentId={studentId}
          data={groupData}
          groupType={"confirmed"}
        />
      ),
    },
    {
      key: "Historical",
      label: "Historical",
      children: (
        <GroupList
          studentId={studentId}
          data={groupData}
          groupType={"historical"}
        />
      ),
    },
  ];

  
  const tabListTutor = [
    {
      key: "Request",
      label: "Request",
      children: <RequestAppointment tutorId={tutorId} data={dataList} onAppointmentChanged={fetchAppointment} />,
    },
    {
      key: "Confirmed",
      label: "Confirmed",
      children: (
        <GroupListTutor
          tutorId={tutorId}
          data={groupData}
          groupType={"confirmed"}
        />
      ),
    },
    {
      key: "Historical",
      label: "Historical",
      children: (
        <GroupListTutor
          tutorId={tutorId}
          data={groupData}
          groupType={"historical"}
        />
      ),
    },
  ];

  if (fetching) {
    return <Spin indicator={antIcon} />;
  }
  return (
    <div
      style={{
        padding: 24,
        minHeight: 360,
        background: colorBgContainer,
      }}
    >
      <Tabs
        items={(userType===userTypes.Student)?tabListStudent:tabListTutor}
        defaultActiveKey="Upcoming"
        animated={false}
        onChange={handleTabChange}
      />
    </div>
  );
};

export default AppointmentsPage;
