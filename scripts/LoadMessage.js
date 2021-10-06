const user = qnext.getValue('user');


const splitterIcon = '🔸';
const delIcon = '🗑';
const delLink = 't.me/MestoInfoBot?start=delmess$chatId_$messageId';
async function run() {
  const db = await qnext.database.system();
  const messages = await db.collection('SavedMessages').find({
    userId: user.id,
  }).toArray();
  exports.messagesResult = messages;
  if (!messages.length) {
    exports.messages = 'Нет сохраненных сообщений. Используйте команду !save в чате, чтобы сохранить сообщение';
    return;
  }
  const textLines = messages.map(data => {
    const date = qnext.date.toLocal(data.ctime);
    let text = qnext.date.format(date, 'yyyy.mm.dd')+splitterIcon+(data.text||'');
    //
    const delUrl = delLink.replace('$chatId', data.chatId).replace('$messageId', data.messageId);
    return text +' ' + qnext.html.link('Открыть', data.link) + '  '+qnext.html.link(delIcon+'Удалить', delUrl);
  })
  exports.messages = textLines.join('\n\n')
}

run().finally(qnext.onFinish);
// LoadMessages
