import React, { useState, useEffect } from "react";
import {
  DatePicker,
  Slider,
  Radio,
  Space,
  Button,
  Select,
  Cascader,
} from "antd";
import { getAllCourseNames } from "../clients/courseClient";
import { getAllTimeZones } from "../clients/generalClient";
import formatTimeZones from "./profile/formatTimeZones";
import "../css/Filter.css";

const { RangePicker } = DatePicker;

export const defaultFilters = {
  course: null,
  timeRange: [null, null],
  rating: [0, 5],
  location: null,
  ratingSortOrder: "highest",
};

// An example of filter
/**
{
    "course": "Physics",
    "timeRange": [
        "2023-11-12T13:00:00.732Z",
        "2023-11-12T15:45:00.732Z"
    ],
    "rating": [
        1,
        5
    ],
    "location": [
        "Africa",
        "Accra"
    ],
    "ratingSortOrder": "highest"
}
 */

export const Filter = ({ onFilterChange, initialValues = defaultFilters }) => {
  const [course, setCourse] = useState(initialValues.course);
  const [timeRange, setTimeRange] = useState(initialValues.timeRange);
  const [rating, setRating] = useState(initialValues.rating);
  const [location, setLocation] = useState(initialValues.location);
  const [ratingSortOrder, setRatingSortOrder] = useState(
    initialValues.ratingSortOrder
  );

  // list of all available courses on the platform
  const [allCourses, setAllCourses] = useState([]);

  // list of all available time zones obtained from backend
  const [allTimeZones, setAllTimeZones] = useState(null);

  const handleCourseChange = (value) => {
    setCourse(value);
    updateFilters({ course: value });
  };

  const handleTimeRangeChange = (timeRange) => {
    timeRange = timeRange === null ? defaultFilters.timeRange : timeRange;
    console.log(timeRange);
    setTimeRange(timeRange);
    updateFilters({ timeRange: timeRange });
  };

  const handleLocationChange = (location) => {
    setLocation(location);
    updateFilters({ location: location });
  };

  const handleRatingChange = (value) => {
    setRating(value);
    updateFilters({ rating: value });
  };

  const handleRatingSortOrderChange = (e) => {
    setRatingSortOrder(e.target.value);
    updateFilters({ ratingSortOrder: e.target.value });
  };

  const handleReset = () => {
    setCourse(defaultFilters.course);
    setTimeRange(defaultFilters.timeRange);
    setRating(defaultFilters.rating);
    setLocation(defaultFilters.location);
    setRatingSortOrder(defaultFilters.ratingSortOrder);
    updateFilters(defaultFilters);
  };
  const updateFilters = (newFilters) => {
    // Call the passed in onFilterChange function with all current filter values
    onFilterChange({
      course,
      timeRange,
      rating,
      ratingSortOrder,
      ...newFilters,
    });
  };

  /**
   * Send an HTTP GET request to get all courses
   */
  const fetchAllCourses = () => {
    getAllCourseNames()
      .then((res) => res.json())
      .then((data) => {
        setAllCourses(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /**
   * Send an HTTP GET request to get all available time zones
   */
  const fetchTimeZones = () => {
    getAllTimeZones()
      .then((res) => res.json())
      .then((data) => {
        setAllTimeZones(formatTimeZones(data));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchAllCourses();
    fetchTimeZones();
  }, []);

  return (
    <div className="filter-component">
      <div className="filter-item">
        <Space>
          <span>Courses: </span>
          <Select
            placeholder="select courses"
            value={course}
            onChange={handleCourseChange}
            style={{
              minWidth: "150px",
            }}
            options={allCourses.map((item) => ({
              value: item,
              label: item,
            }))}
          />
        </Space>
      </div>
      <div className="filter-item">
        <Space>
          <span>Time Range:</span>
          <RangePicker
            showTime={{ format: "HH:mm" }}
            minuteStep={15}
            format="YYYY-MM-DD HH:mm"
            value={timeRange}
            onChange={handleTimeRangeChange}
          />
        </Space>
      </div>
      <div className="filter-item">
        <Space>
          <span>Location:</span>
          <Cascader
            value={location}
            options={allTimeZones}
            onChange={handleLocationChange}
          />
        </Space>
      </div>
      <div className="filter-item">
        <span>Rating Range:</span>
        <Slider
          range
          step={0.5}
          min={0}
          max={5}
          value={rating}
          onChange={handleRatingChange}
        />
      </div>
      <div className="filter-item">
        <Space>
          <span>Tutor's Ratings:</span>
          <Radio.Group
            value={ratingSortOrder}
            onChange={handleRatingSortOrderChange}
          >
            <Radio.Button value="highest">Highest to Lowest</Radio.Button>
            <Radio.Button value="lowest">Lowest to Highest</Radio.Button>
          </Radio.Group>
        </Space>
      </div>
      <Button onClick={handleReset}>reset</Button>
    </div>
  );
};
