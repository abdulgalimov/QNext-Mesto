const {divider, where, steps} = qnext.getValue('localVar');

const targets = [];
const names = {
  block: 4,
  unblock: 5,
  startAuth: 1001,
  sendOkEmail: 1003,
  sendErrEmail: 1004,
  emailOpenOk: 1005,
  emailOpenErr: 1006,
  rulesOk: 1007,
  rulesErr: 1008,
};
async function run() {
  exports.run1 = 1;
  try {
    const tasksData = {};

    function createSql(name, param1) {
      exports['run'+param1] = name;
      if (!steps || steps.includes(name)) {
        const options = {
          select: 'count() as value, (intDiv(toUInt32(createdDate), ' + divider + ') * ' + divider + ') * 1000 as time',
          where: where.time + ' param1 = ' + param1,
          group: 'time',
          order: 'time'
        }
        tasksData[name] = qnext.customStats.read(options);
      }
    }

    exports.run2 = 2;
    Object.keys(names).map(key => {
      createSql(key, names[key]);
    })
    exports.tasksData = tasksData;
    const result = await qnext.tasks.parallel(tasksData);
    Object.keys(result).map(key => {
      getTarget(key, result[key]);
    })
  } catch (err) {
    exports.err = err.message;
  }
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
