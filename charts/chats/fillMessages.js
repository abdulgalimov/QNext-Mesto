const {divider, where} = qnext.getValue('localVar');

const targets = [];
async function run() {
  const {messages, users} = await qnext.tasks.parallel({
    messages: qnext.customStats.read({
      select: 'count() as value, (intDiv(toUInt32(createdDate), '+divider+') * '+divider+') * 1000 as time',
      where: where.time+' param1 = 2003 and param2 != -1001501275697 '+where.chat,
      group: 'time',
      order: 'time'
    }),
    users: qnext.customStats.read({
      select: 'count(distinct param3) as value, (intDiv(toUInt32(createdDate), '+divider+') * '+divider+') * 1000 as time',
      where: where.time+' param1 = 2003 and param2 != -1001501275697 '+where.chat,
      group: 'time',
      order: 'time'
    }),
  });
  targets.push(getTarget('Сообщения', messages));
  targets.push(getTarget('Уникальные пользователи', users));
  exports.targets = targets;
}

function getTarget(name, data) {
  exports.sql = data.sql;
  const datapoints = data.result.response.map(item => {
    return [item.value, item.time];
  });
  return {
    target: name,
    datapoints
  }
}

run().finally(qnext.onFinish);
// fillMessages
