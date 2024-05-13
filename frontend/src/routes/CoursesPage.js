import React, { useEffect, useState } from "react";
import {
    Row,
    Col,
    Flex,
    Input,
    Popover,
    Spin,
    Select,
} from "antd";
import { v4 as uuid } from "uuid";
import CourseCard from "../components/course/CourseCard";
import {
    SearchOutlined,
    FilterOutlined,
    PlusOutlined
} from "@ant-design/icons";
import { useOutletContext } from "react-router-dom";
import { getAllCourses } from '../clients/courseClient'

const createGridRow = (courses) => {
  return (
    <Flex wrap="wrap" gap="middle">
        {courses.map(course => {
          return (
              <CourseCard course={course} />
          );
        })}
    </Flex>
  );
};

const flattenTags = courses =>
    [...new Set(courses.flatMap(c => c.tagSet))];

const mapTags = tags =>
    tags.map(tag => {
        return {
            label: tag,
            value: tag,
        }
    })

const CoursesPage = () => {
    // whether the page is loading
    const [isLoading, setIsLoading] = useState(false);

    const [setTitle] = useOutletContext();
    setTitle("Explore Courses");

    // tutors to be displayed after all filters are applied
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [courseList, setCourseList] = useState([]);

    // the text in the search bar to match tutor's name
    const [searchText, setSearchText] = useState("");

    // filter on course tags
    const [filterTags, setFilterTags] = useState([]);

    // stores all courses' tags
    const [courseTags, setCourseTags] = useState([]);

    const handleTagsChange = (value) => {
        setFilterTags(value);
    };


    const filterCoursesOnName = course => {
        if (searchText === null || searchText === '') return true;
        return course.courseName.toLowerCase()
            .includes(searchText.toLowerCase());
    }

    const filterCoursesOnTags = course => {
        if (filterTags === []) return true;
        return filterTags.every(tag => course.tagSet.includes(tag));
    }

    const applyFilters = () => {
        setIsLoading(true);
        const formatedFilter = {
            courseName: searchText.trim(),
        };
        getAllCourses()
        .then((res) => res.json())
        .then((data) => {
            const res = data.data.filter(filterCoursesOnName).filter(filterCoursesOnTags)
            setFilteredCourses(res);
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

    const fetchCourses = () => {
        setIsLoading(true);
        getAllCourses()
        .then((res) => res.json())
        .then(data => {
            setCourseList(data.data);
            setCourseTags(flattenTags(data.data));
        })
        .finally(() => {
            setIsLoading(false);
        });
    }

    useEffect(() => {
        applyFilters();
    }, [searchText, filterTags]);

    useEffect(() => {
        fetchCourses();
    }, []);

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
                style={{ width: '60%' }}
                trigger={["click"]}
                placement="bottom"
                title="Filter Course"
                content={
                    <Select
                        mode="multiple"
                        size="middle"
                        placeholder="Please select course tag(s)"
                        defaultValue={[]}
                        onChange={ handleTagsChange }
                        style={{ width: '100%' }}
                        options={ mapTags(courseTags) }
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
        createGridRow(filteredCourses)
      )}
    </>
  );
};

export default CoursesPage;
