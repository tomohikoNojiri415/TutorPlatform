import React, { useEffect, useState } from "react";
import { Card, Empty, Button } from "antd";
import SignUpRequestCard from "./SignUpRequestCard";
import {
  approveTutorSignUpRequest,
  declineTutorSignUpRequest,
  getAllPendingTutorSignUpRequests,
} from "../clients/adminClient";
import { EyeOutlined } from "@ant-design/icons";
import { v4 as uuid } from "uuid";
import { errorNotification, successNotification } from "./notifications";
import { useNavigate } from "react-router-dom";

const SignUpRequests = ({ onTutorsListChange }) => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  const handleApprove = (tutorId) => {
    approveTutorSignUpRequest(tutorId)
      .then((res) => res.json())
      .then((data) => {
        successNotification(data.message);
        onTutorsListChange();
        fectchAllRequests();
      })
      .catch((err) => {
        err.response.json().then((res) => {
          errorNotification("Failed to approve", res.message);
        });
      });
  };

  const handleDecline = (tutorId) => {
    declineTutorSignUpRequest(tutorId)
      .then((res) => res.json())
      .then((data) => {
        fectchAllRequests();
        successNotification(data.message);
      })
      .catch((err) => {
        err.response.json().then((res) => {
          errorNotification("Failed to decline", res.message);
        });
      });
  };

  const fectchAllRequests = () => {
    getAllPendingTutorSignUpRequests()
      .then((res) => res.json())
      .then((data) => {
        setRequests(data.data);
        console.log(data.data);
      });
  };

  useEffect(() => {
    fectchAllRequests();
  }, []);

  return (
    <Card
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p>Sign Up Requests</p>
          <Button
            icon={<EyeOutlined />}
            onClick={() => navigate("/admin/tutors/declined-requests")}
          >
            View Declined Requests
          </Button>
        </div>
      }
      bodyStyle={{
        maxHeight: "400px",
        overflowY: "auto",
      }}
    >
      {requests.length === 0 ? (
        <Empty
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          imageStyle={{
            height: 60,
          }}
          description={<span>No Requests yet</span>}
        ></Empty>
      ) : (
        requests.map((request) => (
          <SignUpRequestCard
            key={uuid()}
            request={request}
            onApprove={handleApprove}
            onDecline={handleDecline}
          />
        ))
      )}
    </Card>
  );
};
export default SignUpRequests;
