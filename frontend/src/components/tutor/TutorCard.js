import React, { useState } from "react";
import { Card, Space, Button, Modal } from "antd";
import { MailOutlined, HomeOutlined } from "@ant-design/icons";
import TutorDesciption from "./TutorDescription";
import { useOutletContext, Link } from "react-router-dom";
import { userTypes } from "../../types";
import RateView from "../common/Rating";
const { Meta } = Card;

const TutorCard = ({ tutor }) => {
  // console.log(tutor);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const [, authContext] = useOutletContext();
  const userType = authContext.userType;

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal
        title="Tutor Info"
        width={700}
        open={isModalOpen}
        footer={
          userType === userTypes.Student ? (
            <Link
              to={{
                pathname: `/appointments/booking/${tutor.id}`,
              }}
            >
              <Button size="medium">Book An Appointment</Button>
            </Link>
          ) : null
        }
        onCancel={handleCancel}
        destroyOnClose="true"
      >
        <TutorDesciption tutor={tutor} />
      </Modal>
      <Card
        hoverable
        style={{
          width: "200px",
          height: "320px",
        }}
        onClick={showModal}
        cover={
          <div
            style={{
              overflow: "hidden",
              height: "150px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              src={
                tutor.imgUrl
                  ? tutor.imgUrl
                  : "https://www.unsw.edu.au/content/unsw-sites/au/en/science/our-schools/babs/about-us/professional-and-technical-staff/_jcr_content/root/responsivegrid-layout-fixed-width/responsivegrid-full-top/column_layout_copy_c/par_2_1_50/column_layout_copy/par_2_1_50/image.coreimg.82.1170.jpeg/1668559537766/2021-07-blank-avatar.jpeg"
              }
              alt=""
            />
          </div>
        }
        extra={<RateView value={tutor.rateAve} />}
      >
        <Meta
          title={[tutor.firstName, tutor.lastName].join(" ")}
          description={
            <>
              <div>
                <Space>
                  <HomeOutlined />
                  <p
                    style={{
                      margin: "0",
                    }}
                  >
                    {tutor.timeZone}
                  </p>
                </Space>
              </div>
              <div>
                <Space>
                  <MailOutlined />
                  <p
                    style={{
                      margin: "0",
                    }}
                  >
                    {tutor.email}
                  </p>
                </Space>
              </div>
            </>
          }
        />
      </Card>
    </>
  );
};
export default TutorCard;
