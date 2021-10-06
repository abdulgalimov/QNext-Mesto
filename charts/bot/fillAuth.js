const {divider, where} = qnext.getValue('localVar');

const targets = [];
function createSql(param1) {
  const options = {
    select: 'count() as value, (intDiv(toUInt32(createdDate), '+divider+') * '+divider+') * 1000 as time',
    where: where.time + ' param1 = '+param1,
    group: 'time',
    order: 'time'
  }
  return qnext.customStats.read(options);
}
async function run() {
  const result = await qnext.tasks.parallel({
    block: createSql(4),
    unblock: createSql(5),
    startAuth: createSql(1001),
    sendOkEmail: createSql(1003),
    sendErrEmail: createSql(1004),
    emailOpenOk: createSql(1005),
    emailOpenErr: createSql(1006),
    rulesOk: createSql(1007),
    rulesErr: createSql(1008),
  });
  Object.keys(result).map(key => {
    getTarget(key, result[key]);
  })
  //
  exports.targets = targets;
}

function getTarget(name, data) {
  if (!data) return;
  const datapoints = data.result.response.map(item => {
    return [item.value, item.time];
  });
  targets.push({
    target: name,
    datapoints
  });
}

run().finally(qnext.onFinish);
