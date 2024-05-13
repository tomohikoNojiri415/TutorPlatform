import React, {useState} from "react";
import { Avatar,Modal } from "antd";
import {
  SmileOutlined,
  FileOutlined,
  UserOutlined
} from "@ant-design/icons";
import "../../css/Message.css"
import { getAuthContext } from "../../utils/util";
import { reactMessage } from "../../clients/messageClient";

/**
 * Message component for displaying a single message.
 *
 * This component renders an individual message within a chat interface. It supports different types of message content,
 * including text, images, and documents. For image messages, a modal is provided for viewing the image in larger size.
 * The component also allows users to react to messages with predefined emojis.
 *
 * Props:
 * @param {Object} message - The message object to display. This object should contain message details including senderId,
 *                           senderType, imgUrl, docUrl, messageBody, reaction, sendTime, userAvatar, username.
 */

const Message = ({ message }) => {
  const authContext = getAuthContext();
  //a flag stating whether the logged in user is the sender of the message
  const isMyMessage = authContext.id === message.senderId && authContext.userType === message.senderType;
  //status of the react message action: 'none' (default unless message has been reacted), 'selecting','selected'
  const [reactionState, setReactionState] = useState(message.reaction === ''? 'none':message.reaction); 
  //the chosen reaction of the message
  const [selectedReaction, setSelectedReaction] = useState(message.reaction);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const reactions = ['❤️', '😂', '😢', '👍'];

  /*Modal fucntions */
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const toggleReactions = () => {
    setReactionState('selecting');
  };

  /**
   * Handles the action of reacting to a message.
   *
   * Sets the user's reaction to a message and updates the UI accordingly. If the same reaction is clicked again,
   * it removes the reaction. The function also calls `reactMessage` to update the reaction in the backend.
   *
   * @param {string} reaction - The reaction type (like 'like', 'heart', etc.).
   */
  const react = (reaction) => {
    setSelectedReaction(selectedReaction === reaction ? '' : reaction); 
    setReactionState(selectedReaction === reaction ? 'none': 'selected');
    reactMessage(message.id,selectedReaction === reaction ? '' : reaction);
  };

  /**
   * Renders the message content based on its type.
   *
   * Determines how to display the message content based on the message type. If the message contains an image URL,
   * it renders an image that can be clicked to open in a modal. If the message has a document URL, it renders
   * a link to the document(using the messageBody as title). Otherwise, it displays the message body as text.
   *
   */
  const renderMessageContent = () => {
    if (message.imgUrl !== '') {
        return <div><img src={message.imgUrl} alt="Unvaialble" onClick={showModal} style={{ maxWidth: '100%', maxHeight: '100%' }} /><Modal footer={null} title="Image" width={"60%"} minHeight={400} open={isModalOpen} onCancel={handleCancel}><img src={message.imgUrl} alt="Unvaialble" style={{ width: '100%', height: '100%' }} /></Modal></div>
    }else if (message.docUrl !== '') {
        return <div><FileOutlined /> <a className="message-file-link"href={message.docUrl} target="_blank" rel="noopener noreferrer">{message.messageBody}</a></div>;
    }else {
        return <p>{message.messageBody}</p>;
    }
  };

  return (
    <div className={`message-container ${isMyMessage ? 'right-align' : ''}`}>
      <div className="date-container">
        {message.sendTime}
      </div>
      <div className={`message-wrapper ${isMyMessage ? 'right-align' : ''}`}>
        { isMyMessage ? (
          <div className="message-main">
            <div className="void"/>
            <div className="reaction-button">
              {reactionState !== 'none' && (
                <div className="reactions">
                  {selectedReaction !== '' && (
                    <span className="emoji-right">
                      {selectedReaction}
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="speech-bubble-container right">
              <blockquote className="speech-bubble right">
              {renderMessageContent()}
              </blockquote>
            </div>
            <Avatar style={{backgroundColor:"#cccccc"}} src={message.userAvatar ? message.userAvatar:<UserOutlined/> } alt={message.username} />
          </div>
        ) : (
          <div className="message-main">
            <Avatar style={{backgroundColor:"#cccccc"}} src={message.userAvatar ? message.userAvatar:<UserOutlined/>} alt={message.username} />
            <div className="speech-bubble-container left">
                <blockquote className="speech-bubble left">
                  {renderMessageContent()}
                </blockquote>
            </div>
            <div className="reaction-button">
              {reactionState === 'none' && (
                <span className="emoji" onClick={() => toggleReactions()}>
                  <SmileOutlined className="emoji-button" />
                </span>
              )}
              {reactionState !== 'none' && (
                <div className="reactions">
                  {selectedReaction !== '' ? (
                    <span className="emoji" onClick={() => react(selectedReaction)}>
                      {selectedReaction}
                    </span>
                  ) : (
                    reactions.map((reaction, index) => (
                      <span className="emoji" key={index} onClick={() => react(reaction)}>
                        {reaction}
                      </span>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
