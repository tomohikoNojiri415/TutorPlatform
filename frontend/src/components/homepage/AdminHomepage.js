import React, { useEffect, useState, useRef } from "react";
import { Table } from "antd";
import { getAdmin } from "../../clients/adminClient";

import { getColumnSearchPropsHelper } from "./getColumnSearchProps";
import { useOutletContext } from "react-router-dom";
import { getAllUsersCombined } from "../../utils/util";

const AdminHomepage = () => {
  const [setTitle, authContext] = useOutletContext();

  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const [, setFilteredInfo] = useState({});

  const fetchAllUsers = () => {
    getAllUsersCombined().then((data) => {
      setUsers(data);
    });
  };

  const loadCurrentUser = () => {
    getAdmin(authContext.id)
      .then((res) => res.json())
      .then((data) => {
        const name = [data.data.firstName, data.data.lastName].join(" ");
        setTitle("Welcome to the Admin Dashboard, " + name + "!");
      });
  };

  useEffect(() => {
    fetchAllUsers();
    loadCurrentUser();
  }, []);

  const handleChange = (pagination, filters, sorter) => {
    console.log("Various parameters", pagination, filters, sorter);
    setFilteredInfo(filters);
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

  const columns = [
    {
      title: "Role",
      dataIndex: "userType",
      key: "userType",
      filters: [
        {
          text: "ADMIN",
          value: "ADMIN",
        },
        {
          text: "STUDENT",
          value: "STUDENT",
        },
        {
          text: "TUTOR",
          value: "TUTOR",
        },
      ],
      onFilter: (value, record) => record.userType.includes(value),
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
      title: "Phone No.",
      dataIndex: "phone",
      key: "phone",
      ...getColumnSearchProps("location"),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      ...getColumnSearchProps("location"),
    },
  ];
  return <Table columns={columns} dataSource={users} onChange={handleChange} />;
};
export default AdminHomepage;
