import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    theme, Spin, Space, Button, Input, Flex, Avatar, List
} from 'antd';
import {
  LoadingOutlined,
  QuestionCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import dayjs from 'dayjs';

import '../App.css';
import { activeAppointment, handleAppointmentById } from '../clients/appointmentClient';
import { errorNotification } from '../components/notifications';
import { getAuthContext } from '../utils/util';

const RequestAppointment = ({data, onAppointmentChanged}) => {

  console.log(data)
  const [renderData, setRenderData] = useState([]);
  const [fetching, setFetching] = useState(false);

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  useEffect(() => {
    setRenderData(data.sort((a, b) => { return dayjs(a.startTime) - dayjs(b.startTime) }));
  }, []);
  console.log(renderData);
  
  const handleAccept = (id) => {
    setFetching(true);
    handleAppointmentById(id, 'APPROVE')
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setRenderData(renderData.filter(x => x.id !== id));
      })
      .catch((err) => {
        console.log(err);
        err.response.json().then((res) => {
          errorNotification(
            "There was an issue",
            `${res.message} [${res.status}] [${res.error}]`
          );
        });
      }).finally(() => setFetching(false));
  }

  const handleReject = (id) => {
    setFetching(true);
    handleAppointmentById(id, 'DECLINE')
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setRenderData(renderData.filter(x => x.id !== id));
      })
      .catch((err) => {
        console.log(err);
        err.response.json().then((res) => {
          errorNotification(
            "There was an issue",
            `${res.message} [${res.status}] [${res.error}]`
          );
        });
      }).finally(() => setFetching(false));
  }


  if (fetching) {
    return <Spin indicator={antIcon} />;
  }
  return (
    <List
      size="large"
      bordered
      pagination={{ position: 'bottom', align: 'end' }}
      dataSource={renderData}
      renderItem={(item) => (
        <List.Item key={item.tutorId}>
          <List.Item.Meta
            avatar={<Avatar src={item.imgUrl} />}
            title={'Student: ' + item.studentName}
            description={
              <Flex vertical>
                <div>Email: {item.email}</div>
                <div>Course: {item.courseName}</div>
              </Flex>
            }
          />
          <Space size={100}>
            <Flex vertical align="flex-end">
              <div>Start: {dayjs(item.timeStart).format('h:mm A MM/DD/YYYY')}</div>
              <div>End: {dayjs(item.timeEnd).format('h:mm A MM/DD/YYYY')}</div>
            </Flex>
            <Flex
              style={{ color: 'green' }}
            >
              <Space >
              <Button onClick={()=>handleAccept(item.id)}>Accept</Button>
              <Button onClick={()=>handleReject(item.id)}>Reject</Button>
              <Link to={`/messages?studentId=${item.studentId}`}>
                <Button>
                  Message
                </Button>
              </Link>
              </Space>
              
            </Flex>
          </Space>
        </List.Item>
      )}
    />
  )
}
export default RequestAppointment;
