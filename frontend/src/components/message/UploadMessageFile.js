import React, { useEffect, useState } from 'react';
import "../../css/UploadMessageFile.css";
import { InboxOutlined } from '@ant-design/icons';
import { Upload} from 'antd';
import { storage } from '../../firebase';
import { uploadFileUrl } from '../../utils/uploadFileUtils';
import { getDownloadURL, ref} from 'firebase/storage';
import { errorNotification } from '../notifications';

const { Dragger } = Upload;

const UploadMessageFile = ({fileType, onFileListChange, shouldClearFile, alterShouldClearFile}) => {
  const [fileList, setFileList] = useState([]);
  const [filePath, setFilePath] = useState();


  const handleChange = (info) => {
    // add this newly updated file to fileList
    if (info.file.status === 'done') {
      // grab url from firebase
      getDownloadURL(ref(storage, filePath))
        .then((url) => {
          const updatedList = [...fileList, {
            uid: info.file.uid,
            name: info.file.name,
            status: 'done',
            url: url
          }]
          setFileList(updatedList);
          onFileListChange(updatedList);
        });
    }

    // delete this file from fileList
    if (info.file.status === 'removed') {
      const updatedFilelist = fileList.filter(file => {
        return file.uid !== info.file.uid
      })
      setFileList(updatedFilelist);
      onFileListChange(updatedFilelist);
    }
  };
  //check file number and type before uploading
  const beforeUpload = (file) => {
    if (fileList.length >= 1) {
      errorNotification('Input Error', 'You can only upload one file.');
      return Upload.LIST_IGNORE;
    }
    if (fileType === 'image') {
      const isSupportedImageType = ['image/jpeg', 'image/png','image/gif', 'image/bmp', 'image/svg+xml'].includes(file.type);
      if (!isSupportedImageType) {
        errorNotification('File Type Error', 'Unsupported image type.');
        return Upload.LIST_IGNORE;
      }
      return true;
    }
    return true;
  };

  const props = {
    name: 'file',
    multiple: false,
    defaultFileList: fileList,
    beforeUpload: beforeUpload,
    onDrop (e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  useEffect(()=>{
    setFileList([]);
    alterShouldClearFile(false);
  },[shouldClearFile, alterShouldClearFile])

  return (
    <div className='upload-file-container'>
      <Dragger
        key={fileList.length}
        {...props}
        customRequest={(info) => { uploadFileUrl(info, "messages", (path) => { setFilePath(path) }) }}
        onChange={handleChange}
      >
        <div className='upload-text-wrapper'>
          <div className='message-file-upload-icon'>
            <InboxOutlined />
          </div>
          <div className="upload-text">Click or drag file to this area to upload</div>
        </div>
      </Dragger>
    </div>
  );
};

export default UploadMessageFile;
