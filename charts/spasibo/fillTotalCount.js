const {divider, where} = qnext.getValue('localVar');

const targets = [];
async function run() {
  const {membersCount} = await qnext.tasks.parallel({
    membersCount: qnext.customStats.read({
      select: 'count() as value, createdDate as time',
      where: where.time+' param1 = 2009 ',
    })
  });
  targets.push(getTarget('Всего Spasibo', membersCount));
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
