const {divider, where} = qnext.getValue('localVar');

const targets = [];
async function run() {
  const counts = qnext.customStats.read({
    select: 'count() as value, (intDiv(toUInt32(createdDate), '+divider+') * '+divider+') * 1000 as time',
    where: `${where.time} param1 = 2009 and param2 != -1001501275697 ${where.user}`,
    group: 'time',
    order: 'time'
  })
  targets.push(getTarget('Spasibo', counts));
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
