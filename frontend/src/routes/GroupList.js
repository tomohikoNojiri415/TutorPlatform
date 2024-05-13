import React, { useState, useEffect } from 'react';
import {
    Layout, theme, Card, List, Space, Button, Avatar, Rate, Flex, Divider, Spin
} from 'antd';
import dayjs from 'dayjs';
import { getLastRate, updateRate } from '../clients/tutorClient';
import { errorNotification } from '../components/notifications';
import {
  LoadingOutlined,
  QuestionCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import '../App.css';
import MessagesPage from './MessagesPage.js';
import { Link } from 'react-router-dom';
const { Meta } = Card;

let score = {};

const GroupList = (props) => {
  console.log(props);
  const [renderData, setRenderDate] = useState([]);
  const [fetching, setFetching] = useState(false);
  // const [score, setScore] = useState(null);
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  const fetchLastRate = () => {
    setFetching(true);
    getLastRate(props.studentId)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        score = data.data;
        console.log(score);
      }).catch(err => {
        console.log(err);
        err.response.json().then(res => {
          errorNotification(
            "There was an issue",
            `${res.message} [${res.status}] [${res.error}]`
          )
        });
      }).finally(() => setFetching(false));
  }

  useEffect(() => {
    setRenderDate(Object.entries(props.data).sort());
    fetchLastRate();
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

  // const columns = [
  //     {
  //         title: 'Start Time',
  //         dataIndex: 'timeStart',
  //         key: 'startTime',
  //     },
  //     {
  //         title: 'End Time',
  //         dataIndex: 'timeEnd',
  //         key: 'endTime',
  //     },
  //     {
  //         title: 'Course',
  //         dataIndex: 'courseName',
  //         key: 'courseName',
  //     }
  // ];
  

  // const getScore = (tutorId) => {
  //   fetchLastRate(tutorId);
  //   console.log(score);
  //   return score[tutorId];
  // }
  
  const updateScore = (tutorId, value) => {
    console.log({
      "studentId": props.studentId,
      "tutorId": tutorId,
      "value": value
    });
    updateRate({
      "studentId": props.studentId,
      "tutorId": tutorId,
      "value": value
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      score[tutorId] = value;
    }).catch(err => {
      console.log(err);
      err.response.json().then(res => {
        errorNotification(
          "There was an issue",
          `${res.message} [${res.status}] [${res.error}]`
        )
      });
    });
  }

  // const renderAppointmentList = () => {
  //   return <>
  //     {props.data
  //       ? <>
  //       <Divider />  
  //       {Object.entries(props.data).sort().map((item) =>
  //         <>
  //           <Flex justify='space-between' align='center'>
  //             <h1>{item[0]}</h1>
  //             {(props.groupType === 'historical') ?<>
  //               <Rate 
  //                 allowHalf 
  //                 defaultValue={getScore(item[1][0].tutorId)}
  //                 onChange={value => updateScore(item[1][0].tutorId, value)}
  //               ></Rate></>
  //               :<><Button type="primary">Message...</Button></>
  //             }
  //           </Flex>
  //           <Table
  //             pagination={false}
  //             columns={columns}
  //             dataSource={item[1].sort((a, b) => { return dayjs(a.startTime) - dayjs(b.startTime) })}
  //           />
  //         </>
  //       )}</>
  //       :
  //         <h1>No Data</h1>
  //     }
  //   </>
  // }
    
  const {
      token: { colorBgContainer },
  } = theme.useToken();

  if (fetching) {
    return <Spin indicator={antIcon} />;
  }
  return (
    // <Layout>
    //   <Header
    //     style={{
    //       padding: 0,
    //       background: colorBgContainer,
    //     }}
    //   />
    //   <Content
    //     style={{
    //       margin: '0 16px',
    //     }}
    //   >
    //     <div
    //       style={{
    //         padding: 24,
    //         minHeight: 360,
    //         background: colorBgContainer,
    //       }}
    //     >
    //       { renderAppointmentList() }
    //     </div>
    //   </Content>
    // </Layout>
      <div
        style={{
          padding: 24,
          // minHeight: 360,
          background: colorBgContainer,
        }}
      >
        {renderData?
        <Space direction='vertical' size='large'>
        {renderData.map((item) =>
          <Card
            hoverable
            style={{ width: 920}}
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
                  title={'Tutor: ' + item[0]}
                />
                {(props.groupType === 'historical') ?<>
                  <Rate 
                    allowHalf 
                    defaultValue={score[item[1][0].tutorId]}
                    onChange={value => updateScore(item[1][0].tutorId, value)}
                  ></Rate></>
                  : <>
                    <Link to={`/messages/${item[1][0].tutorId}`}>
                      <Button 
                        type="primary"
                      >
                        Message
                      </Button>
                    </Link>
                    </>
                }
              </Flex>
              <br /> 
              <List
                size="large"
                bordered
                dataSource={sortAppointment(item[1])}
                renderItem={(item) => (
                  <List.Item key={item.tutorName}>
                    <div>Course: {item.courseName}</div>
                    <Flex vertical align="flex-end">
                      <div>Start: {dayjs(item.timeStart).format('h:mm A MM/DD/YYYY')}</div>
                      <div>End: {dayjs(item.timeEnd).format('h:mm A MM/DD/YYYY')}</div>
                    </Flex>
                  </List.Item>
                )}
              />
            </Flex>

          </Card>
        )}
        </Space>
        :
          <h1>No Data</h1>
      }
      </div>
    )
}
export default GroupList;
