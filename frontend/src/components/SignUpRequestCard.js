import React from "react";
import { Card, Button, Typography, Space, Popconfirm } from "antd";
import "../css/RequestCard.css";
import {
  MailOutlined,
  UserOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const SignUpRequestCard = ({
  request,
  onApprove,
  onDecline,
  isDeclineEnabled = true,
}) => {
  return (
    <Card
      style={{
        maxWidth: "500px",
        boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)",
        marginBottom: "10px",
      }}
    >
      <div className="request-card">
        <div className="request-info">
          <div>
            <Space>
              <UserOutlined />
              <Text strong>{request.tutorName}</Text>
            </Space>
          </div>
          <div>
            <Space>
              <MailOutlined />
              <Text strong>{request.tutorEmail}</Text>
            </Space>
          </div>
        </div>
        <div className="request-actions">
          <Space>
            <Button onClick={() => onApprove(request.tutorId)}>Approve</Button>
            {isDeclineEnabled ? (
              <Popconfirm
                title="Delete"
                description={`Are you sure to decline ${request.tutorName}'s request?`}
                okText="Yes"
                icon={
                  <QuestionCircleOutlined
                    style={{
                      color: "red",
                    }}
                  />
                }
                onConfirm={() => onDecline(request.tutorId)}
              >
                <Button danger>Decline</Button>
              </Popconfirm>
            ) : null}
          </Space>
        </div>
      </div>
    </Card>
  );
};

export default SignUpRequestCard;
