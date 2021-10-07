const request = qnext.getValue('request');
const {divider, target, viewChat} = qnext.getValue('localVar');

async function run() {
  const whereChat = viewChat !== 'all' ? ' AND param2=' + viewChat : '';
  const {membersLanguages} = await qnext.tasks.parallel({
    membersLanguages: qnext.customStats.read({
      select: 'now() AS time, param5 as code, count() AS cnt, param3 as userId',
      where: 'param1 = 2003 AND param5 > 0 ' + whereChat,
      group: 'param5,param3',
    })
  });
  exports.membersLanguages = membersLanguages;
  //
  const byCodes = {};
  membersLanguages.result.response.map(item => {
    byCodes[item.code] = byCodes[item.code] || 0
    byCodes[item.code] ++;
  });
  exports.byCodes = byCodes;
  //
  exports.targets = Object.keys(byCodes).map(key => {
    const code = +key||0;
    const count = byCodes[key];
    const language = qnext.isoLanguages.getById(code);
    const name = language ? language.name : qnext.isoLanguages.decode(code);
    return {
      target: name||'Unknown',
      datapoints: [[
        count, 0,
      ]]
    }
  })
}

run().finally(qnext.onFinish);
// fillMembersLanguages
