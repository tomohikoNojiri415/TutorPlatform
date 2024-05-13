import { useState, useEffect, useRef } from "react";
import "../App.css";
import { Table, Spin, Popconfirm, Button } from "antd";
import { LoadingOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { errorNotification } from "../components/notifications";
import { invertActiveStatus } from "../clients/adminClient";
import { getAllUsers } from "../clients/adminClient";
import { getColumnSearchPropsHelper } from "../components/homepage/getColumnSearchProps";
import NumUsersBadge from "./NumUsersBadge";

const AdminUserActionTable = ({ userType, refeshKey }) => {
  const [users, setUsers] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [sortedInfo, setSortedInfo] = useState({});
  const [, setFilteredInfo] = useState({});

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  const fetchUsers = () =>
    getAllUsers(userType)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        data.data.forEach((e) => {
          e.name = e.firstName + " " + e.lastName;
        });
        setUsers(data.data);
      })
      .catch((err) => {
        console.log(err);
        err.response.json().then((res) => {
          console.log(res);
          errorNotification(
            "There was an issue",
            `${res.message} [${res.status}] [${res.error}]`
          );
        });
      })
      .finally(() => setFetching(false));

  useEffect(() => {
    fetchUsers();
  }, [refeshKey]);

  const toggleUser = (record) => {
    console.log(record);
    invertActiveStatus(userType, record.id).then(() => {
      fetchUsers();
    });
  };

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
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
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Is Active",
      dataIndex: "isActive",
      key: "isActive",
      filters: [
        {
          value: true,
          text: "YES",
        },
        {
          value: false,
          text: "NO",
        },
      ],
      onFilter: (value, record) => record.isActive === value,
      render: (value) => {
        return <p>{value ? "YES" : "NO"}</p>;
      },
    },
    {
      title: "Action",
      key: "action",
      width: "20%",
      render: (record) => {
        const actionName = record.isActive ? "Deactivate" : "Activate";
        return (
          <Popconfirm
            title={`${actionName}`}
            description={`Are you sure to ${actionName} ${record.firstName}?`}
            okText="Yes"
            icon={
              <QuestionCircleOutlined
                style={{
                  color: "orange",
                }}
              />
            }
            onConfirm={() => toggleUser(record)}
          >
            <Button danger={record.isActive}>{actionName}</Button>
          </Popconfirm>
        );
      },
    },
  ];

  const renderAdmin = () => {
    if (fetching) {
      return <Spin indicator={antIcon} />;
    }
    return (
      <>
        <Table
          dataSource={users}
          columns={columns(toggleUser, fetchUsers)}
          rowKey={(user) => user.id}
          title={() => (
            <NumUsersBadge
              title={`Total number of ${userType.toLowerCase()}s:`}
              numUsers={users.length}
            />
          )}
          onChange={handleChange}
        />
      </>
    );
  };
  return renderAdmin();
};
export default AdminUserActionTable;
