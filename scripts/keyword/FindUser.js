
const {keyWords} = qnext.getValue('dynamicVar');
const message = qnext.getValue('update.message');
let text = message ? message.text||message.caption : null;

const chat = qnext.getValue('chat');
const chatId = Math.abs(chat.id)+'';
exports.link = 'https://t.me/c/'+chatId.slice(3)+'/'+message.message_id;

const notifyUsers = [];
async function run() {
  if (!text) return;
  text = text.toLowerCase();
  Object.keys(keyWords).map(key => {
    if (text.includes(key)) {
      const ids = keyWords[key];
      if (!ids) return;
      ids.map(id => {
        if (!notifyUsers.includes(id)) notifyUsers.push(id);
      })
    }
  })
  //
  exports.notifyUsers = notifyUsers;
}

run().finally(qnext.onFinish);
// FindUser
