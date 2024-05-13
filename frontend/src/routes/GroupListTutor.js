import React, { useState, useEffect } from 'react';
import {
    Layout, theme, Card, List, Space, Button, Avatar, Rate, Flex, Divider, Empty
} from 'antd';
import dayjs from 'dayjs';
import { errorNotification } from '../components/notifications';

import '../App.css';
import MessagesPage from './MessagesPage.js';
import { Link } from 'react-router-dom';
const { Meta } = Card;

const GroupListTutor = (props) => {
  console.log(props);
  const [renderData, setRenderDate] = useState([]);

  useEffect(() => {
    setRenderDate(Object.entries(props.data).sort());
  }, []);
  console.log(renderData);
  
  const sortAppointment = (item) => {
    if (props.groupType === 'historical') {
      item.sort((a, b) => { return dayjs(b.startTime) - dayjs(a.startTime) });
    } else {
      item.sort((a, b) => { return dayjs(a.startTime) - dayjs(b.startTime) });
    }
    return item;
  }
  
  const {
      token: { colorBgContainer },
  } = theme.useToken();

  return (
      <div
        style={{
          padding: 24,
          // minHeight: 360,
          background: colorBgContainer,
        }}
      >
        {(renderData && renderData.length!=0)?
        <Space direction='vertical' size='large'>
        {renderData.map((item) =>
          <Card
            hoverable
            style={{ width: 920 }}
            bodyStyle={{
              padding: 20,
              minHeight: 200,
              maxHeight: 300,
              overflowY: 'auto',
            }}
          >
            <Flex
              vertical
              >
              <Flex
                justify="space-between"
                align="flex-end"
              >
                <Meta
                  avatar={<Avatar src={item[1][0].imgUrl} />}
                  title={'Student: ' + item[0]}
                />
                {props.groupType === 'confirmed' ?
                  <Link to={`/messages/${item[1][0].studentId}`}>
                    <Button>
                      Message
                    </Button>
                  </Link>
                :
                  <></>
                }
              </Flex>
              <br /> 
              <List
                size="large"
                bordered
                dataSource={sortAppointment(item[1])}
                renderItem={(item) => (
                  <List.Item key={item.studentName}>
                    <div>Course: {item.courseName}</div>
                    <Flex vertical align="flex-end">
                      <div>Start: {dayjs(item.timeStart).format('h:mm A MM/DD/YYYY')}</div>
                      <div>End: {dayjs(item.timeEnd).format('h:mm A MM/DD/YYYY')}</div>
                    </Flex>
                    {props.groupType === 'confirmed' ?
                      null
                    :
                      <></>
                    }
                  </List.Item>
                )}
              />
            </Flex>

          </Card>
        )}
        </Space>
        :
          <Empty />
      }
      </div>
    )
}
export default GroupListTutor;
