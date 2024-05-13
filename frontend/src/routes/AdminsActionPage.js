import { useState, useEffect, useRef } from "react";
import { Table, Spin, Button, Popconfirm } from "antd";
import {
  LoadingOutlined,
  QuestionCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  errorNotification,
  successNotification,
} from "../components/notifications";
import { getAllUsers, deleteAdmin } from "../clients/adminClient";
import { getColumnSearchPropsHelper } from "../components/homepage/getColumnSearchProps";
import AdminDrawer from "./AdminDrawer";
import { userTypes } from "../types";
import { useOutletContext } from "react-router-dom";
import NumUsersBadge from "../components/NumUsersBadge";

const ShowAllAdmins = () => {
  const [users, setUsers] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [setTitle] = useOutletContext();
  const [sortedInfo, setSortedInfo] = useState({});
  const [, setFilteredInfo] = useState({});

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [showDrawer, setShowDrawer] = useState(false);

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const fetchUsers = () =>
    getAllUsers(userTypes.Admin)
      .then((res) => res.json())
      .then((data) => {
        data.data.forEach((e) => {
          e.adminName = e.firstName + " " + e.lastName;
        });
        setUsers(data.data);
      })
      .catch((err) => {
        err.response.json().then((res) => {
          errorNotification("Failed to fetch users", res.message);
        });
      })
      .finally(() => setFetching(false));

  useEffect(() => {
    console.log("component is mounted");
    fetchUsers();
    setTitle("Manage Admins");
  }, []);

  const removeUser = (id) => {
    deleteAdmin(id)
      .then(() => {
        successNotification(`The admin is successfully deleted`);
        fetchUsers();
      })
      .catch((err) => {
        err.response.json().then((res) => {
          errorNotification("Failed to delete admin", res.message);
        });
      });
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => {
    return getColumnSearchPropsHelper(
      dataIndex,
      searchInput,
      handleSearch,
      handleReset,
      searchedColumn,
      searchText
    );
  };

  const columns = () => [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
      sortOrder: sortedInfo.columnKey === "id" ? sortedInfo.order : null,
    },
    {
      title: "Admin Name",
      dataIndex: "adminName",
      key: "adminName",
      ...getColumnSearchProps("adminName"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Action",
      key: "action",
      width: "20%",
      render: (record) => (
        <>
          {record.id === 1 ? null : (
            <Popconfirm
              title="Delete"
              description={`Are you sure to delete ${record.firstName}?`}
              okText="Yes"
              icon={
                <QuestionCircleOutlined
                  style={{
                    color: "red",
                  }}
                />
              }
              onConfirm={() => removeUser(record.id, fetchUsers)}
            >
              <Button danger>Delete</Button>
            </Popconfirm>
          )}
        </>
      ),
    },
  ];

  const renderAdmin = () => {
    if (fetching) {
      return <Spin indicator={antIcon} />;
    }
    return (
      <>
        <AdminDrawer
          showDrawer={showDrawer}
          setShowDrawer={setShowDrawer}
          fetchAdmins={fetchUsers}
        />
        <Table
          dataSource={users}
          columns={columns()}
          rowKey={(user) => user.id}
          onChange={handleChange}
          title={() => (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <NumUsersBadge
                title="Total number of admins:"
                numUsers={users.length}
              />
              <Button
                icon={<PlusOutlined />}
                onClick={() => setShowDrawer(!showDrawer)}
              >
                Create a new admin
              </Button>
            </div>
          )}
        />
      </>
    );
  };

  return (
    <>
      <div>{renderAdmin()}</div>
    </>
  );
};
export default ShowAllAdmins;
