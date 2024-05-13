import React, { useState, useEffect, useRef } from 'react';
import {
    Layout, theme, Table, Space, Button, Input, Flex, Avatar, List, Typography
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import dayjs from 'dayjs';

import '../App.css';

// const { Header, Content } = Layout;

const AppointmentList = (props) => {
  const [renderData, setRenderDate] = useState([]);

  useEffect(() => {
    setRenderDate(props.data.sort((a, b) => { return dayjs(a.startTime) - dayjs(b.startTime) }));
  }, []);
  console.log(renderData);
    
  // const [searchText, setSearchText] = useState('');
  // const [searchedColumn, setSearchedColumn] = useState('');
  // const searchInput = useRef(null);
  // const handleSearch = (selectedKeys, confirm, dataIndex) => {
  //   confirm();
  //   setSearchText(selectedKeys[0]);
  //   setSearchedColumn(dataIndex);
  // };

  // const handleReset = (clearFilters) => {
  //   clearFilters();
  //   setSearchText('');
  // };

  // const getColumnSearchProps = (dataIndex) => ({
  //   filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
  //     <div
  //       style={{
  //         padding: 8,
  //       }}
  //       onKeyDown={(e) => e.stopPropagation()}
  //     >
  //       <Input
  //         ref={searchInput}
  //         placeholder={`Search ${dataIndex}`}
  //         value={selectedKeys[0]}
  //         onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
  //         onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
  //         style={{
  //           marginBottom: 8,
  //           display: 'block',
  //         }}
  //       />
  //       <Space>
  //         <Button
  //           type="primary"
  //           onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
  //           icon={<SearchOutlined />}
  //           size="small"
  //           style={{
  //             width: 90,
  //           }}
  //         >
  //           Search
  //         </Button>
  //         <Button
  //           onClick={() => clearFilters && handleReset(clearFilters)}
  //           size="small"
  //           style={{
  //             width: 90,
  //           }}
  //         >
  //           Reset
  //         </Button>
  //         <Button
  //           type="link"
  //           size="small"
  //           onClick={() => {
  //             confirm({
  //               closeDropdown: false,
  //             });
  //             setSearchText(selectedKeys[0]);
  //             setSearchedColumn(dataIndex);
  //           }}
  //         >
  //           Filter
  //         </Button>
  //         <Button
  //           type="link"
  //           size="small"
  //           onClick={() => {
  //             close();
  //           }}
  //         >
  //           close
  //         </Button>
  //       </Space>
  //     </div>
  //   ),
  //   filterIcon: (filtered) => (
  //     <SearchOutlined
  //       style={{
  //         color: filtered ? '#1677ff' : undefined,
  //       }}
  //     />
  //   ),
  //   onFilter: (value, record) =>
  //     record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
  //   onFilterDropdownOpenChange: (visible) => {
  //     if (visible) {
  //       setTimeout(() => searchInput.current?.select(), 100);
  //     }
  //   },
  //   render: (text) =>
  //     searchedColumn === dataIndex ? (
  //       <Highlighter
  //         highlightStyle={{
  //           backgroundColor: '#ffc069',
  //           padding: 0,
  //         }}
  //         searchWords={[searchText]}
  //         autoEscape
  //         textToHighlight={text ? text.toString() : ''}
  //       />
  //     ) : (
  //       text
  //     ),
  // });

  // const columns = [
  //   {
  //     title: 'Start Time',
  //     dataIndex: 'timeStart',
  //     key: 'startTime',
  //   },
  //   {
  //     title: 'End Time',
  //     dataIndex: 'timeEnd',
  //     key: 'endTime',
  //   },
  //   {
  //     title: 'Course',
  //     dataIndex: 'courseName',
  //     key: 'courseName',
  //     ...getColumnSearchProps('courseName'),
  //   },
  //   {
  //     title: 'Tutor Name',
  //     dataIndex: 'tutorName',
  //     key: 'tutorName',
  //     ...getColumnSearchProps('tutorName'),
  //   },
  //   {
  //     title: 'Status',
  //     dataIndex: 'status',
  //     key: 'status',
  //     ...getColumnSearchProps('status'),
  //   },
  // ];

  // const renderAppointmentList = () => {
  //   return <>
  //     <Table
  //       columns={columns}
  //       dataSource={props.data.sort((a, b) => { return dayjs(a.startTime) - dayjs(b.startTime) })}
  //       rowKey={(student) => student.id}
  //     />
  //   </>
  // }

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    // <Layout>
    //   <Header
    //       style={{
    //           padding: 0,
    //           background: colorBgContainer,
    //       }}
    //   />
    //   <Content
    //     style={{
    //       margin: '0 16px',
    //     }}
    //   >
    //     <div
    //         style={{
    //             padding: 24,
    //             minHeight: 360,
    //             background: colorBgContainer,
    //         }}
    //     >
    //         { renderAppointmentList() }
    //     </div>
    //   </Content>
    // </Layout>
    <List
      size="large"
      bordered
      pagination={{ position: 'bottom', align: 'end' }}
      dataSource={renderData}
      renderItem={(item) => (
        <List.Item key={item.tutorId}>
          <List.Item.Meta
            avatar={<Avatar src={item.imgUrl} />}
            title={'Tutor: ' + item.tutorName}
            // description={'Email:' + '<br/>' + 'Course: ' + item.courseName}
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
            <div
            style={{color:item.status === 'PENDING'?'orange':'green'}}
            >{item.status}</div>
          </Space>
        </List.Item>
      )}
    />
  )
}
export default AppointmentList;
