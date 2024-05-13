import React, { useEffect, useState } from "react";
import { Card, Empty, Button } from "antd";
import SignUpRequestCard from "../components/SignUpRequestCard";
import {
  approveTutorSignUpRequest,
  getAllDeclinedTutorSignUpRequests,
} from "../clients/adminClient";
import { v4 as uuid } from "uuid";
import {
  successNotification,
  errorNotification,
} from "../components/notifications";
import { useNavigate } from "react-router-dom";

const DelinedRequests = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  const handleApprove = (tutorId) => {
    console.log(tutorId);
    approveTutorSignUpRequest(tutorId)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        successNotification(data.message);
        fectchAllRequests();
      })
      .catch((err) => {
        err.response.json().then((res) => {
          errorNotification("Failed to approve", res.message);
        });
      });
  };

  const fectchAllRequests = () => {
    getAllDeclinedTutorSignUpRequests()
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setRequests(data.data);
        console.log(data.data);
      });
  };

  useEffect(() => {
    fectchAllRequests();
  }, []);

  return (
    <>
      <Button
        style={{ marginBottom: "10px" }}
        onClick={() => navigate("/admin/tutors")}
      >
        Back
      </Button>
      <Card title={<p>Declined Sign Up Requests</p>}>
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
              isDeclineEnabled={false}
            />
          ))
        )}
      </Card>
    </>
  );
};
export default DelinedRequests;
