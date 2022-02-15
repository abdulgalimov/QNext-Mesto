const {divider, where} = qnext.getValue('localVar');

const targets = [];
async function run() {
  const {join, left, kick} = await qnext.tasks.parallel({
    join: qnext.customStats.read({
      select: 'count() as value, (intDiv(toUInt32(createdDate), '+divider+') * '+divider+') * 1000 as time',
      where: where.time + ' param1 = 2001 '+where.chat + where.user,
      group: 'time',
      order: 'time'
    }),
    left: qnext.customStats.read({
      select: 'count() as value, (intDiv(toUInt32(createdDate), '+divider+') * '+divider+') * 1000 as time',
      where: where.time+' param1 = 2002 '+where.chat + where.user,
      group: 'time',
      order: 'time'
    }),
    kick: qnext.customStats.read({
      select: 'count() as value, (intDiv(toUInt32(createdDate), '+divider+') * '+divider+') * 1000 as time',
      where: where.time+' param1 = 2008 '+where.chat + where.user,
      group: 'time',
      order: 'time'
    })
  });
  exports.join = join;
  targets.push(getTarget('Вход', join));
  targets.push(getTarget('Выход', left));
  targets.push(getTarget('Блокировка', kick));
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
// fillLeftJoin
