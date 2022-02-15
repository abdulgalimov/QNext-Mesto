const {divider, where} = qnext.getValue('localVar');

const targets = [];
async function run() {
  const totalCount = await qnext.customStats.read({
    select: 'count() as value',
    where: where.time+' param1 = 2009 ',
  });
  console.log('totalCount', totalCount);
  targets.push(getTarget('Всего Spasibo', totalCount));
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
