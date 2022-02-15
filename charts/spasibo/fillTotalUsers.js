const {divider, where} = qnext.getValue('localVar');

const targets = [];
async function run() {
  const totalUsers = await qnext.customStats.read({
    select: 'count(distinct param3) as value',
    where: where.time+' param1 = 2009 ',
  });
  console.log('totalUsers', totalUsers);
  targets.push(getTarget('Всего Пользователей', totalUsers));
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
// fillMembersCount
