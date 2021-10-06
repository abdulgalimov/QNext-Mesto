const user = qnext.getValue('user');
const chat = qnext.getValue('chat');
const message = qnext.getValue('update.message');


let text = message.text||'';
if (text) {
  text = text.replaceAll(/!(save)|(сохранить)/gi, '').trim();
}

async function run() {
  const db = await qnext.database.system();
  const messageId = message.message_id;
  let linkChatId;
  if (chat) {
    linkChatId = (''+chat.id).substr(4);
  }
  const data = {
    userId: user.id,
    chatId: chat ? chat.id : null,
    messageId,
    text,
    link: linkChatId ? 'https://t.me/c/'+linkChatId+'/'+messageId : null,
    ctime: new Date(),
  };
  exports.saveData = data;
  if (message.reply_to_messsage) {
    data.replyToMesssage = message.reply_to_messsage.message_id;
  }
  await db.collection('SavedMessages').insertOne(data);
}

run().finally(qnext.onFinish);
// SaveMessage
