const request = qnext.getValue('request');
const {divider, target, viewChat} = qnext.getValue('localVar');

async function run() {
  const whereChat = viewChat !== 'all' ? ' AND param2='+viewChat : '';
  const {membersCount} = await qnext.tasks.parallel({
    membersCount: qnext.customStats.read({
      select: 'max(param3) as count, (intDiv(toUInt32(createdDate), 20) * 20) * 1000 as time',
      where: 'param1 = 2100 '+whereChat,
      group: 'time',
      order: 'time desc',
      limit: 1,
    })
  });
  exports.membersCount = membersCount;
  exports.targets = [{
    target: '-',
    datapoints: [[
      membersCount.result.response[0].count, 0
    ]]
  }];
}

run().finally(qnext.onFinish);
// fillMembersStat
