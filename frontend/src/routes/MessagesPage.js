import React, {useState, useEffect, useRef} from "react";
import "../css/MessagesPage.css"
import { useParams } from 'react-router-dom';
import { Layout, Input, Button, List, Avatar, Select} from "antd";
import { UploadOutlined, FileImageOutlined, MessageOutlined, SendOutlined, UserOutlined} from "@ant-design/icons"; 
import Message from "../components/message/Message"
import UploadMessageFile from "../components/message/UploadMessageFile";
import { errorNotification} from "../components/notifications";
import { getAuthContext, getTokenFromLocalStorage} from "../utils/util";
import { getTutorContacts, getTutorInfoById } from "../clients/tutorClient";
import { getStudentContacts ,getStudentInfoById } from "../clients/studentClient";
import { getUserMessages, postMessage } from "../clients/messageClient";
import {over} from 'stompjs';
import SockJS from 'sockjs-client';

/**
 * `MessagesPage` component for displaying and managing messages.
 * It includes functionality for displaying a list of contacts,
 * a list of messages with a selected contact, and a message input area.
 * It uses WebSocket for real-time communication and provides features
 * like selecting a contact, sending messages, and uploading files.
 */

const { Sider, Content } = Layout;
const { TextArea } = Input;

let stompClient = null;

const MessagesPage = () => {
  const authContext = getAuthContext();
  //points to end of message for autoscroll
  const messagesEndRef = useRef(null);
  //preload defaultContactId's conversation
  const { defaultContactId } = useParams();
  //datas
  //the contact id that is selected to have a conversation
  const [selectedContact, setSelectedContact] = useState(defaultContactId?defaultContactId: null);
  //the name of the selected contact 'firstName lastName', when no one selected shows 'Private Message'
  const [selectedContactName, setSelectedContactName] = useState('Private Message');
  // a list of contacts 
  const [contacts, setContacts] = useState([]);
  // a list of messages 
  const [messages, setMessages] = useState([]);

  //input value states
  //the type of message input: 'text' (default), 'image', 'file'
  const [inputType, setInputType] = useState('text');
  //text input field content
  const [inputText, setInputText] = useState('');
  //list of file input
  const [uploadedFiles, setUploadedFiles] = useState([]);
  //a flag suggesting whether the appending uploadedFileList should be cleared
  const [shouldClearFile, setShouldClearFile] = useState(false);

  //websocket subscription object
  const [currentSubscription, setCurrentSubscription] = useState(null);

  /**
   * Handles change events on the contact search input. It filters
   * and rearranges the contacts based on the search input.
   * @param {string} value - The selected value from the search input, the string of contact id
   */
  const onChange = (value) => {
    if (contacts === null){return ;}
    setContacts(prevContacts => {
      const filteredContacts = prevContacts.filter(contact => contact.id !== parseInt(value));
      if (filteredContacts.length > 0 ){
        const selectedContact = prevContacts.find(contact => contact.id === parseInt(value));
        return [selectedContact, ...filteredContacts];
      } else {
        return prevContacts;
      }
    });
  };

   /**
   * Custom filter function for contact search. Filters contacts
   * based on matching input with contact labels.
   * @param {string} input - The user input for contact search.
   * @param {object} option - The current option being evaluated.
   * @returns {boolean} - Whether the option should be displayed based on the input.
   */
  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  /**
   * Callback for handling changes in the uploaded file list.
   * @param {Array} newFileList - The new list of uploaded files.
   */
  const handleFileListChange = (newFileList) => {
    setUploadedFiles(newFileList);
  };

  /**
   * Determines the opposite user type.
   * 
   * Given a user type ('TUTOR' or 'STUDENT'), this function returns the opposite type.
   * If 'TUTOR' is passed, it returns 'STUDENT', and vice versa.
   *
   * @param {string} userType - The current user type ('TUTOR' or 'STUDENT').
   * @returns {string} - The opposite user type ('STUDENT' for 'TUTOR' input, and 'TUTOR' for 'STUDENT' input).
   */
  const opposeUserType = (userType) => {
    return userType === 'TUTOR' ? 'STUDENT' : 'TUTOR';
  }
  /**
   * Constructs a conversation ID based on the user types and IDs.
   * 
   * The id disregards the sender and receiver. It is a combination of the id of the two parties in the conversation. 
   * It has the format tutorId-studentId
   * @param {number|string} targetId - The ID of the target user in the conversation.
   * @returns {string} - The constructed conversation ID.
   */
  const determineConversationId = (targetId) =>{
    return (authContext.userType === 'TUTOR'? authContext.id : targetId) + '-' + (authContext.userType === 'STUDENT' ? authContext.id : targetId);
  }

  /**
   * Establishes a WebSocket connection using Stomp over SockJS.
   *
   * This function initiates a WebSocket connection if one is not already established (`stompClient` is null).
   * It uses the SockJS client to connect to the WebSocket URL specified in the environment variable `REACT_APP_WEBSOCKET_URL`.
   * Upon establishing the connection, it uses the `Authorization` header, which includes a token retrieved from local storage.
   * The `onConnected` callback is invoked upon successful connection, and `onError` is called in case of an error.
   *
   */
  const connect =()=>{
    if (stompClient!== null){
      return;
    }
    let Sock = new SockJS(process.env.REACT_APP_WEBSOCKET_URL);
    stompClient = over(Sock);
    const headers = {
      'Authorization': 'Bearer ' + getTokenFromLocalStorage(),
    };
    stompClient.connect(headers,onConnected, onError);
  }

  const onConnected = () => {
    console.log('connected to WS');
  }
  const onError = (err) => {
    errorNotification('WebSocket Connection Failed', err)
  }

  /**
   * Subscribes to a specific conversation topic over a WebSocket connection.
   *
   * This function subscribes to a WebSocket topic that corresponds to a particular conversation ID.
   * If there's an existing subscription, it first unsubscribes to avoid overlapping subscriptions.
   * Once subscribed to the new topic, any incoming messages for this conversation are handled.
   * The function updates the messages state with the new message or updates an existing message if found.
   * It also sets the current subscription to this new subscription for future reference.
   *
   * @param {string} conversationId - The ID of the conversation to subscribe to.
   */
  const subscribeToConversation = (conversationId) => {
    if ( stompClient !== null&& stompClient.connected) {
      //unsubscribe to avoid cross text
      if (currentSubscription) {
        currentSubscription.unsubscribe();
      }
      const topic = `/topic/conversation/${conversationId}`;
      const newSubscription = stompClient.subscribe(topic, (message) => {
        // Handle incoming messages for this conversation
        const newMessage = JSON.parse(message.body);
        setMessages(prevMessages => {
          const messageIndex = prevMessages.findIndex(msg => msg.id === newMessage.id);
          if (messageIndex !== -1) {
            const updatedMessages = [...prevMessages];
            updatedMessages[messageIndex] = newMessage;
            return updatedMessages;
          } else {
            return [...prevMessages, newMessage];
          }
        });
      });
      setCurrentSubscription(newSubscription);
    }
  };
  
  /**
   * Fetches and sets the list of contacts dynamically based on the user type.
   *
   * This function dynamically loads contacts depending on whether the authenticated user is a 'TUTOR' or a 'STUDENT'.
   * For tutors, it fetches a list of student IDs they have appointments with and then retrieves detailed information 
   * for each student. For students, it does the same but with tutor IDs. The detailed information includes first name, 
   * last name, image URL, and time zone of each contact. The contacts data is then set to the state.
   * In case of an error during fetching, an error notification is displayed.
   */
  const fetchContacts = () => {
    if (authContext.userType === 'TUTOR'){
      getTutorContacts( authContext.id)
        .then((response)=> response.json())
        .then((data)=>{
          const studentIdPromises = data.data.map((studentId)=>{
            return getStudentInfoById(studentId)
              .then((res) => res.json())
              .then((studentData) => {
                const studentDetails = studentData.data;
                return {
                  id: studentId, 
                  userType: 'STUDENT',
                  firstName: studentDetails.firstName,
                  lastName: studentDetails.lastName,
                  imgUrl: studentDetails.studentImgUrl, 
                  timeZone: studentDetails.timeZone 
                };
              });
          })
          return Promise.all(studentIdPromises); 
        })
        .then((fetchedStudents)=>{
          setContacts(fetchedStudents);
        })
        .catch((err) => {
          err.response.json().then((res) => {
            errorNotification("Failed to view Appointments", res.message);
          });
        });
    } else {
      getStudentContacts( authContext.id)
        .then((response)=> response.json())
        .then((data)=>{
          const tutorIdPromises = data.data.map((tutorId)=>{
            return getTutorInfoById(tutorId)
              .then((res) => res.json())
              .then((tutorData) => {
                const tutorDetails = tutorData.data;
                return {
                  id: tutorId, 
                  userType: 'TUTOR',
                  firstName: tutorDetails.firstName,
                  lastName: tutorDetails.lastName,
                  imgUrl: tutorDetails.studentImgUrl, 
                  timeZone: tutorDetails.timeZone 
                };
              });
          })
          return Promise.all(tutorIdPromises); 
        })
        .then((fetchedTutors)=>{
          setContacts(fetchedTutors);
        })
        .catch((err) => {
          err.response.json().then((res) => {
            errorNotification("Failed to load contacts", res.message);
          });
        });
    }
  }

  /**
   * Fetches and sets messages for a selected contact.
   *
   * Retrieves messages between the authenticated user and a specified contact. Updates the messages state 
   * with the fetched data. In case of an error, displays an error notification.
   *
   * @param {number|string} id - The ID of the selected contact.
   */
  const fetchMessages = (id) => {
    getUserMessages( authContext.userType, authContext.id, opposeUserType(authContext.userType), id)
      .then((response)=> response.json())
      .then((data)=> setMessages(data.data))
      .catch((err) => {
        err.response.json().then((res) => {
          errorNotification("Failed to load messages", res.message);
        });
      });
  }

  /**
   * Sends a message to the selected contact.
   *
   * Constructs a message object based on the input type (text, image, or file) and sends it to the selected contact.
   * The message includes details like sender and receiver IDs and types, and relevant content URLs for images or files.
   * After sending the message, it resets the input fields and clears any uploaded files.
   *
   * Note: Does not send a message if no contact is selected or if the input is empty.
   */
  const sendMessage = () => {
    if (selectedContact === null){return;}
    if ((inputType === 'text' &&  inputText==='')|| ((inputType === 'image' || inputType === 'file') && uploadedFiles.length ===0)){ return;}
    const message = {
      senderId: authContext.id,
      senderType: authContext.userType,
      receiverId: selectedContact,
      receiverType: opposeUserType(authContext.userType),
      messageBody: inputType === 'file'? uploadedFiles[0].name: inputText,
      imgUrl: inputType === 'image'?uploadedFiles[0].url :'',
      docUrl: inputType === 'file'?uploadedFiles[0].url :'',
      reaction: '',
    }
    postMessage(message);
    setInputText(''); 
    setUploadedFiles([]);
    setShouldClearFile(true);
  }
  /**
   * Handles actions when a contact is clicked.
   *
   * Initiates a series of actions when a user clicks on a contact. This includes subscribing to the 
   * conversation associated with the selected contact, setting the selected contact's ID and name, 
   * and fetching messages related to this contact.
   *
   * @param {number|string} id - The ID of the clicked contact.
   * @param {string} fullName - The full name of the clicked contact.
   */
  const handleContactClick = (id, fullName) =>{
    const conversationId = determineConversationId(id);
    subscribeToConversation(conversationId);
    setSelectedContact(id);
    setSelectedContactName(fullName);
    fetchMessages(id);
  }

  //listener for input text field
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  // type can be text, image, file
  const changeInputType=(type) => {
    if (type !== inputType) {
      setInputType(type);
    }
  }

  useEffect(()=>{
    // on page load, get all the contacts and establish websocket connection
    fetchContacts();
    if (defaultContactId){
      setSelectedContact(defaultContactId);
      handleContactClick(selectedContact, 'Private Message');
    }
    connect();
    return () => {
      if (stompClient !== null && stompClient.connected) {
        stompClient.disconnect();
      }
    }
  },[]);

  useEffect(() => {
    //move to the bottom of the messages list 
    if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div style={{ display: "flex", height: 'calc(100vh - 112px)' }}>
      <Layout>
        <Sider width={250} style={{ background: "#f0f2f5", borderRight: "1px solid #e8e8e8", fontSize:"13px" }}>
          <div className="column-header">
          <Select
            showSearch
            placeholder="Find Contact"
            optionFilterProp="children"
            onChange={onChange}
            onSearch={()=>{}}
            filterOption={filterOption}
            options={contacts.map(contact => ({
              value: contact.id.toString(), // Ensuring 'value' is a string
              label: `${contact.firstName} ${contact.lastName}`,
            }))}
            style={{width:'100%'}}
          />
          </div>
          <div style={{ height: "calc(100% - 40px)", overflowY: "scroll" }}>
            <List
              dataSource={contacts}
              renderItem={(contact) => (
                <List.Item
                  key={contact.id}
                  selected={selectedContact}
                  style={{
                    border: "none", cursor: "pointer", padding: "12px",
                    backgroundColor: selectedContact === contact.id ? "#e8e8e8" : "transparent",
                  }}
                  onClick={() => handleContactClick(contact.id, contact.firstName + ' '+ contact.lastName)}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Avatar style={{backgroundColor:"#cccccc"}} src={contact.imgUrl ?contact.imgUrl: <UserOutlined/>} /> 
                    {/* contact.avatar */}
                    <div style={{ marginLeft: "12px" }}>{contact.firstName} {contact.lastName}</div>
                  </div>
                  <div style={{ marginLeft: "32px" }}>{contact.status}</div>
                </List.Item>
              )}
            />
          </div>
        </Sider>
        <Content className="message-column">
          <div className="column-header">{selectedContactName}</div>
            {/* <MessageList /> */}
          <div className="message-list" style={{ height: "calc(100% - 170px)", overflowY: "scroll" }}>
            {messages.map((message, index) => (
              <Message className="message" key={index+message.reaction} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="input-container">
            <div className="input-section">
              <div className="input-buttons">
                <div>
                  <Button icon={<UploadOutlined />} className="upload-icon" onClick={()=>changeInputType('file')}/>
                  <Button icon={<FileImageOutlined />} className="upload-icon" onClick={()=>changeInputType('image')}/>
                  <Button icon={<MessageOutlined />} className="upload-icon" onClick={()=>changeInputType('text')}/>
                </div>
                <Button type="primary" onClick={()=>sendMessage()}><SendOutlined /></Button>
              </div>
              { inputType === 'text' ?
                <TextArea
                  value={inputText} 
                  onChange={handleInputChange} 
                  placeholder="Type your message" 
                  autoSize={{ minRows: 3, maxRows: 3 }}
                /> 
               : 
                <UploadMessageFile fileType={inputType} onFileListChange={handleFileListChange} shouldClearFile={shouldClearFile} alterShouldClearFile={setShouldClearFile}/>
              }
            </div>
          </div>
        </Content>
      </Layout>
    </div>

  );
};

export default MessagesPage;
