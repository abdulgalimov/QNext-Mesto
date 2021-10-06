const request = qnext.getValue('request');
const {divider, target, viewChat} = qnext.getValue('localVar');

async function run() {
  const whereChat = viewChat !== 'all' ? ' AND param2='+viewChat : '';
  const {membersLanguages} = await qnext.tasks.parallel({
    membersLanguages: qnext.customStats.read({
      select: 'now() AS time, param5 as code, count() AS cnt',
      where: 'param1 = 2003 AND param5 > 0 '+whereChat,
      group: 'param5',
    })
  });
  exports.membersLanguages = membersLanguages;
  exports.targets = membersLanguages.result.response.map(item => {
    const language = qnext.isoLanguages.getById(item.code);
    return {
      target: language ? language.name : 'Unknown',
      datapoints: [[
        item.cnt, 0,
      ]]
    }
  })
}

run().finally(qnext.onFinish);
// fillMembersLanguages
