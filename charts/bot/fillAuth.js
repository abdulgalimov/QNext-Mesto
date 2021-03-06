const {divider, where, steps, target} = qnext.getValue('localVar');

const targets = [];
const names = {
  startAuth: 1001,
  sendEmailOk: 1003,
  sendEmailErr: 1004,
  emailOpenOk: 1005,
  emailOpenErr: 1006,
  rulesOk: 1007,
  rulesErr: 1008,
  block: 4,
  unblock: 5,
};
async function run() {
  const tasksData = {};

  function createSql(name, param1) {
    if (!steps || steps.includes(name)) {
      let options;
      switch (target) {
        case 'auth':
          options = {
            select: 'count() as value, (intDiv(toUInt32(createdDate), ' + divider + ') * ' + divider + ') * 1000 as time',
            where: where.time + ' param1 = ' + param1,
            group: 'time',
            order: 'time'
          }
          break;
        case 'totalEvents':
          options = {
            select: 'count() as value, max(createdDate) as time',
            where: where.time + ' param1 = ' + param1,
          }
          break;
      }
      tasksData[name] = qnext.customStats.read(options);
    }
  }
  Object.keys(names).map(key => {
    createSql(key, names[key]);
  })
  const result = await qnext.tasks.parallel(tasksData);
  console.log('result: '+target, result);
  Object.keys(names).map(key => {
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
