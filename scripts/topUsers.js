
const chat = qnext.getValue('chat');

async function run() {
  if (!chat) return;
  const top = await qnext.customStats.read({
    select: 'count() as cnt, param3 as userId',
    where: 'param1 = 2003 and param2 = '+chat.id,
    group: 'param3',
    order: 'cnt DESC',
    limit: 10,
  })
  exports.top = top.result.response;

}

run().finally(qnext.onFinish);
