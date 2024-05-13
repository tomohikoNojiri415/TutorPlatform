import React, { useEffect, useState } from "react";
import { Row, Col, Input, Popover, Spin } from "antd";
import { v4 as uuid } from "uuid";
import TutorCard from "../components/tutor/TutorCard";

import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import { Filter, defaultFilters } from "../components/Filter";
import { useOutletContext } from "react-router-dom";
import { filterTutors } from "../clients/studentClient";

const createGridRow = (tutors) => {
  return (
    <Row gutter={[{ xs: 8, sm: 16, md: 24 }, 15]}>
      {tutors.map((tutor) => {
        return (
          <Col
            className="gutter-row"
            key={uuid()}
            span={{ xs: 2, sm: 4, md: 6 }}
          >
            <TutorCard tutor={tutor} />
          </Col>
        );
      })}
    </Row>
  );
};

const FindATutor = () => {
  // whether the page is loading
  const [isLoading, setIsLoading] = useState(false);

  const [setTitle] = useOutletContext();
  setTitle("Explore Tutors");

  // tutors to be displayed after all filters are applied
  const [filteredTutors, setFilteredTutors] = useState([]);

  // the text in the search bar to match tutor's name
  const [searchText, setSearchText] = useState("");

  // filters applied to what tutors are displayed
  const [filters, setFilters] = useState(defaultFilters);

  /**
   * replace current filters by the given filters
   *
   * @param {Object} filters updated filters
   *
   */
  const handleFilterChange = (filters) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...filters }));
  };

  /**
   * Initiate an HTTP request to fecth all tutors satisfying the given filters
   * Save returned tutors to the state filteredTutors
   *
   * @param {object} filters current filters
   * @param {string} searchText the text in the search bar
   */
  const applyFilters = (filters, searchText) => {
    setIsLoading(true);
    const formatedFilter = {
      tutorName: searchText.trim(),
      course: filters.course,
      location: filters.location ? filters.location.join("/") : null,
      timeStart: filters.timeRange[0],
      timeEnd: filters.timeRange[1],
      minRate: filters.rating[0],
      maxRate: filters.rating[1],
      ratingSortOrder: filters.ratingSortOrder,
    };
    filterTutors(formatedFilter)
      .then((res) => res.json())
      .then((data) => {
        setFilteredTutors(data.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    applyFilters(filters, searchText);
  }, [filters, searchText]);

  return (
    <>
      <div
        style={{
          padding: "10px 20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        {/* Search Bar */}
        <Input
          style={{
            border: "2px solid lightgray",
            maxWidth: "fit-content",
            padding: "10px 20px",
          }}
          onChange={(e) => {
            setSearchText(e.currentTarget.value);
          }}
          prefix={
            // Filter Component
            <Popover
              trigger={["click"]}
              placement="bottom"
              title="Filter Tutors"
              content={
                <Filter
                  onFilterChange={handleFilterChange}
                  initialValues={filters}
                />
              }
            >
              <FilterOutlined />
            </Popover>
          }
          suffix={<SearchOutlined />}
          size="large"
        />
      </div>

      {isLoading ? ( // Spinning page
        <Spin tip="Loading" size="large">
          <div className="content" />
        </Spin>
      ) : (
        createGridRow(filteredTutors)
      )}
    </>
  );
};

export default FindATutor;
