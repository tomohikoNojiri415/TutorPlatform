import React from "react";
import { useEffect, useCallback } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { getUser } from "../utils/util";
import { timeslotStatus, userTypes } from "../types";
import { useState } from "react";
import Calendar from "../components/calendar/Calendar";
import { getTutorSlot } from "../clients/tutorClient";
import moment from "moment";
import { v4 as uuid } from "uuid";

import { getAllCourseNames } from "../clients/courseClient";
import BookAppointmentModal from "../components/bookAppointmentModal/BookAppointmentModal";
import { bookAnAppointment } from "../clients/studentClient";
import {
  errorNotification,
  successNotification,
} from "../components/notifications";

const BookAnAppointment = () => {
  // getting tutor id from path
  const { tutorId } = useParams();

  const [isLoading, setIsLoading] = useState(false);

  // getting studentId from authContext
  const [setTitle, authContext] = useOutletContext();
  const studentId = authContext.id;

  // the tutor involed in this appointment
  const [tutor, setTutor] = useState(null);

  const [events, setEvents] = useState([]);

  const [modalShow, setModalShow] = useState(false);

  // start time of the booking request
  const [startTime, setStartTime] = useState(null);

  // end time of the booking request
  const [endTime, setEndTime] = useState(null);

  // list of all available courses on the platform
  const [allCourses, setAllCourses] = useState([]);

  // the course selected by this user for a new booking
  const [course, setCourse] = useState(null);

  // the new booking by the user
  const [currEvent, setCurrEvent] = useState(null);

  // Fetch the tutor involved in this appointment
  const fecthUser = (tutorId, setTitle) => {
    getUser(tutorId, userTypes.Tutor)
      .then((res) => res.json())
      .then((data) => {
        setTutor(data.data);
        setTitle(
          "Book an Appointment with " +
            [data.data.firstName, data.data.lastName].join(" ")
        );
      });
  };

  const fetchTimeslots = (tutorId) => {
    getTutorSlot(tutorId)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.data);

        const timeslots = data.data;
        const fetchedEvents = timeslots.map((timeslot) => {
          const status =
            timeslot.timeslotStatus === timeslotStatus.UNCERTAIN
              ? "Pending"
              : "Unavailable";
          return {
            start: moment(timeslot.timeStart).toDate(),
            end: moment(timeslot.timeEnd).toDate(),
            title: status,
            uid: uuid(),
          };
        });
        setEvents(fetchedEvents);
      });
  };

  /**
   * Send an HTTP GET request to get all courses
   */
  const fetchAllCourses = () => {
    getAllCourseNames()
      .then((res) => res.json())
      .then((data) => {
        setAllCourses(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const calendarProps = {
    // student selects a timeslot to book an appointment
    selectable: true,

    onSelectSlot: useCallback(({ start, end }) => {
      setStartTime(start);
      setEndTime(end);
      const newEvent = { start, end, title: "New Booking", uid: uuid() };
      setEvents((prev) => [...prev, newEvent]);
      setCurrEvent(newEvent);
      setModalShow(true);
    }, []),
  };

  const handleCancel = () => {
    setEvents(events.filter((event) => event.uid !== currEvent.uid));
    setCurrEvent(null);
    setModalShow(false);
  };

  useEffect(() => {
    setIsLoading(true);

    fecthUser(tutorId, setTitle);
    fetchTimeslots(tutorId);
    fetchAllCourses();

    setIsLoading(false);
  }, [tutorId, setTitle]);

  const handleOk = () => {
    console.log(startTime);
    bookAnAppointment({
      tutorId,
      studentId,
      courseName: course,
      timeStart: startTime,
      timeEnd: endTime,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        successNotification(data.message);
      })
      .catch((err) => {
        err.response.json().then((error) => {
          setEvents(events.filter((event) => event.uid !== currEvent.uid));
          errorNotification(error.message);
        });
      });

    // reset course after each booking
    setCourse(null);

    setModalShow(false);
  };

  if (isLoading || !tutor) {
    return <div>loading</div>;
  }

  return (
    <>
      <Calendar {...calendarProps} events={events} />
      <BookAppointmentModal
        tutor={tutor}
        handleOk={handleOk}
        handleCancel={handleCancel}
        startTime={startTime}
        endTime={endTime}
        modalShow={modalShow}
        allCourses={allCourses}
        course={course}
        setCourse={setCourse}
      />
    </>
  );
};

export default BookAnAppointment;
