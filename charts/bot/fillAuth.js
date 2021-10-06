const {divider, where} = qnext.getValue('localVar');

const targets = [];
async function run() {
  const {block, unblock} = await qnext.tasks.parallel({
    block: qnext.customStats.read({
      select: 'count() as value, (intDiv(toUInt32(createdDate), '+divider+') * '+divider+') * 1000 as time',
      where: where.time + ' param1 = 4 ',
      group: 'time',
      order: 'time'
    }),
    unblock: qnext.customStats.read({
      select: 'count() as value, (intDiv(toUInt32(createdDate), '+divider+') * '+divider+') * 1000 as time',
      where: where.time + ' param1 = 5 ',
      group: 'time',
      order: 'time'
    }),
  });
  exports.block = block;
  targets.push(getTarget('🚫Блокировка', block));
  targets.push(getTarget('✅Разблокировка', unblock));
  exports.targets = targets;
}

function getTarget(name, data) {
  const datapoints = data.result.response.map(item => {
    return [item.value, item.time];
  });
  return {
    target: name,
    datapoints
  }
}

run().finally(qnext.onFinish);
