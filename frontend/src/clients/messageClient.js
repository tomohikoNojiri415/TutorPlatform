import fetch from 'unfetch';
import {
  checkStatus,
} from '../utils/util';
import {
  getTokenFromLocalStorage
} from '../utils/util.js';

export const getUserMessages = (user1Type, user1Id, user2Type, user2Id) => 
  fetch(`/api/message/${user1Type}/${user1Id}/${user2Type}/${user2Id}`, {
    headers: { 
      'Authorization': 'Bearer ' + getTokenFromLocalStorage() 
    },
    method: 'GET',
  }).then(checkStatus);

export const reactMessage = (messageId, reaction) =>
  fetch(`/api/message/react`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + getTokenFromLocalStorage()
    },
    method: 'POST',
    body: JSON.stringify({
      messageId: messageId,
      reaction: reaction
    })
  }).then(checkStatus);

  export const postMessage = (message) =>
  fetch(`/api/message`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + getTokenFromLocalStorage()
    },
    method: 'POST',
    body: JSON.stringify({
      senderId: message.senderId,
      senderType: message.senderType,
      receiverId: message.receiverId,
      receiverType: message.receiverType,
      messageBody: message.messageBody,
      imgUrl: message.imgUrl,
      docUrl: message.docUrl,
      reaction: message.reaction,

    })
  }).then(checkStatus);