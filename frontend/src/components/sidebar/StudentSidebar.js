import { Link } from "react-router-dom";
import { Menu } from "antd";
import {
  MessageOutlined,
  CalendarOutlined,
  SearchOutlined,
  BarsOutlined,
} from "@ant-design/icons";

const StudentSidebar = () => {
  return (
    <>
      <Menu
        theme="dark"
        mode="inline"
        items={[
          {
            key: "1",
            icon: <MessageOutlined />,
            label: <Link to={`/messages`}>Messages</Link>,
          },
          {
            key: "2",
            icon: <SearchOutlined />,
            label: <Link to={`/find-a-tutor`}>Find a Tutor</Link>,
          },
          {
            key: "3",
            icon: <CalendarOutlined />,
            label: <Link to={`/appointments`}>Appointments</Link>,
          },
        ]}
      />
    </>
  );
};

export default StudentSidebar;
