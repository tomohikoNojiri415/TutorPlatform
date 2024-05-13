import React, { useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import { storage } from "../../firebase";
import { getDownloadURL, ref } from "firebase/storage";
import { v4 as uuid } from "uuid";
import { extractFileName } from "./extractFilename";
import { uploadFileUrl } from "../../utils/uploadFileUtils";

const { Dragger } = Upload;

const getFileListFromUrls = (urls) => {
  return urls.map((url) => {
    return {
      uid: uuid(),
      name: extractFileName(url), // File name
      status: "done",
      url: url, // URL of the file
    };
  });
};

const UploadFile = ({ defaultFileUrls, onChange }) => {
  // the files uploaded
  const [fileList, setFileList] = useState(
    getFileListFromUrls(defaultFileUrls)
  );

  // the file path to be sent to firebase
  const [filePath, setFilePath] = useState();

  const props = {
    name: "file",
    multiple: false,
    defaultFileList: fileList,
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  const handleChange = (info) => {
    console.log(info);

    // add this newly updated file to fileList
    if (info.file.status === "done") {
      // grab url from firebase
      getDownloadURL(ref(storage, filePath)).then((url) => {
        const updatedList = [
          ...fileList,
          {
            uid: info.file.uid,
            name: info.file.name,
            status: "done",
            url: url,
          },
        ];
        setFileList(updatedList);
        onChange(updatedList.map((file) => file.url)); // triggers onChange of the parent Form.Item
      });
    }

    // delete this file from fileList
    if (info.file.status === "removed") {
      const updatedFilelist = fileList.filter((file) => {
        return file.uid !== info.file.uid;
      });
      setFileList(updatedFilelist);
      onChange(updatedFilelist.map((file) => file.url)); // triggers onChange of the parent Form.Item
    }
  };

  return (
    <Dragger
      {...props}
      customRequest={(info) => {
        uploadFileUrl(info, "qualifications", (path) => {
          setFilePath(path);
        });
      }}
      onChange={handleChange}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
    </Dragger>
  );
};

export default UploadFile;
