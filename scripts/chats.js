const chatId = qnext.getValue("targetChat.id", 0)
const savedData = qnext.getValue("globalVar.chats."+chatId, {});

qnext.telegram.api('getChat', {chat_id: chatId}).then(chat => {
  let exportFile = null;
  let exportChat = null;
  //
  exports.loadChatApi = chat;
  if (chat && chat.ok) {
    const photoId = chat.response.photo ? chat.response.photo.big_file_id : undefined;
    exportChat = {
      title: chat.response.title,
      description: chat.response.description,
      id: chat.response.id,
      link: chat.response.invite_link,
      photo: savedData ? savedData.photo : undefined,
    };
    //
    if (photoId) {
      if (!savedData.photo || savedData.photo.id !== photoId || !savedData.photo.url) {
        exportChat.photo = {
          id: photoId,
        }
        exportFile = {
          type: 'photo',
          fileId: photoId,
        }
      }
    }
  }
  //
  exports.chat = exportChat;
  exports.file = exportFile;
  //
  qnext.onFinish();
})