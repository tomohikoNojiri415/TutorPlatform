import React, { useState } from "react";
import { Button, Modal, Space, Typography, Select } from "antd";

import "./index.css";

const { Paragraph, Text } = Typography;

const formatDateTime = (time) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(time).toLocaleString(undefined, options);
};

const BookAppointmentModal = ({
  tutor,
  handleOk,
  handleCancel,
  startTime,
  endTime,
  modalShow,
  allCourses,
  course,
  setCourse,
}) => {
  return (
    <Modal
      title={"Booking an appointment with " + tutor.firstName}
      onOk={handleOk}
      open={modalShow}
      onCancel={handleCancel}
    >
      <div className="modal-content-item">
        <Text>Start Time:</Text>
        <Text>{formatDateTime(startTime)}</Text>
      </div>

      <div className="modal-content-item">
        <Text>End Time:</Text>
        <Text>{formatDateTime(endTime)}</Text>
      </div>

      <div className="modal-content-item">
        <Text>Course: </Text>
        <Select
          placeholder="select courses"
          value={course}
          onChange={setCourse}
          style={{
            minWidth: "150px",
          }}
          options={allCourses.map((item) => ({
            value: item,
            label: item,
          }))}
        />
      </div>
    </Modal>
  );
};
export default BookAppointmentModal;
