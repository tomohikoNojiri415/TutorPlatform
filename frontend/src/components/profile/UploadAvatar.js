/**
 * Display avatar, allow user to modify a new avatar by uploading
 * Images are stored on Firebase
 * The Upload component is used (see https://ant.design/components/upload)
 */
import React, { useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import { storage } from "../../firebase";
import { getDownloadURL, ref } from "firebase/storage";

import { getBase64, uploadFileUrl } from "../../utils/uploadFileUtils";

const UploadAvatar = ({ defultImageUrl, onChange }) => {
  // avatar loading status
  const [loading, setLoading] = useState(false);

  // the download url of the image from firebase
  const [imageUrl, setImageUrl] = useState(defultImageUrl);

  // the image path to be sent to firebase
  const [imagePath, setImagePath] = useState();

  /**
   * Check the file format.
   * Will stop the uploading if file format is not allowed by returning false
   * @param {*} file
   * @returns true if the file format is allowed
   */
  const beforeUpload = (file) => {
    // check file type
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }

    // check image size
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  /**
   * When the status of file is changed:
   *  new upload
   *  uploading => done
   * @param {*} info
   */
  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
    }
    if (info.file.status === "done") {
      // grab url from firebase
      getDownloadURL(ref(storage, imagePath)).then((url) => {
        getBase64(info.file.originFileObj, () => {
          setImageUrl(url);
          setLoading(false);
          onChange(url); // triggers onChange of the parent Form.Item
        });
      });
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  return (
    <>
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        customRequest={(info) => {
          uploadFileUrl(info, "images", (path) => {
            setImagePath(path);
          });
        }}
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="avatar"
            style={{
              width: "100%",
            }}
          />
        ) : (
          uploadButton
        )}
      </Upload>
    </>
  );
};
export default UploadAvatar;
