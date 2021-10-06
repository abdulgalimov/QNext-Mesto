const user = qnext.getValue('user');
const exec = qnext.getValue('exec');


async function run() {
  const chatId = +exec[1]||0;
  const messageId = +exec[2]||0;
  if (!chatId || !messageId) return;
  const db = await qnext.database.system();
  const query = {
    userId: user.id,
    chatId: -chatId,
    messageId,
  };
  await db.collection('SavedMessages').deleteOne(query);
}

run().finally(qnext.onFinish);
// DelMessage
