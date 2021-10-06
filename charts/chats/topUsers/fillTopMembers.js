const {where} = qnext.getValue('localVar');

async function run() {
  const topMembers = await qnext.customStats.read({
    select: 'count() as cnt, param3 as userId',
    where: where.time+' param1 = 2003 and param2 != -1001501275697 '+where.chat,
    group: 'param3',
    order: 'cnt DESC',
    limit: 10,
  })
  exports.topMembers = topMembers.result;
}

run().finally(qnext.onFinish);
// fillTopMembers
