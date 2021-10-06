
const update = qnext.getValue('update')

function getPhoto(message) {
  return {
    type: 'photo',
    fileId: message.photo[message.photo.length-1].file_id,
  }
}
function getAttach(message, type) {
  return {
    type,
    fileId: message[type].file_id,
  }
}
let attach;
if (update && update.message) {
  if (update.message.photo) {
    attach = getPhoto(update.message);
  } else if (update.message.video) {
    attach = getAttach(update.message, 'video');
  } else if (update.message.audio) {
    attach = getAttach(update.message, 'audio');
  } else if (update.message.document) {
    attach = getAttach(update.message, 'document');
  }
}
exports.attach = attach;
