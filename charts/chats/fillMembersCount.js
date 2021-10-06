const {divider, where} = qnext.getValue('localVar');

const targets = [];
async function run() {
  const {membersCount} = await qnext.tasks.parallel({
    membersCount: qnext.customStats.read({
      select: 'max(param3) as value, (intDiv(toUInt32(createdDate), '+divider+') * '+divider+') * 1000 as time',
      where: where.time+' param1 = 2100 '+where.chat,
      group: 'time',
      order: 'time'
    })
  });
  targets.push(getTarget('Количество участников', membersCount));
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
