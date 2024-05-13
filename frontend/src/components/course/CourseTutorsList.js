import {
    List,
    Avatar,
    Divider,
    Skeleton,
    Flex,
} from 'antd';
import { getCourseTutors } from '../../clients/tutorClient';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import TutorCard from '../tutor/TutorCard';
import { LoadingOutlined, } from '@ant-design/icons'

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const CourseTutorsList = ({ courseId }) => {

    const [ tutors, setTutors ] = useState([]);
    const [ loading, setLoading ] = useState(false);

    const fetchTutors = () =>
        getCourseTutors(courseId)
            .then(resp => resp.json())
            .then(data => {
                console.log(data.data)
                console.log(courseId)
                setTutors(data.data)
            })
            .finally(() => setLoading(false));

    useEffect(() => {
        fetchTutors();
    }, []);


    if (loading) return antIcon

    return (
        <div
            id="scrollableDiv"
            style={{
            height: '46.5%',
            overflow: 'auto',
            padding: '0 0px',
            border: '1px solid rgba(140, 140, 140, 0.35)',
            }}
        >
            <InfiniteScroll
                dataLength={tutors.length}
                hasMore={tutors.length < 50}
                // loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                scrollableTarget="scrollableDiv"
            >
                <Flex gap='middle'>
                    {tutors.map(tutor =>
                        <TutorCard tutor={ tutor } />
                    )}
                </Flex>
            </InfiniteScroll>
        </div>
    )
}

export default CourseTutorsList;
