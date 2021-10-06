const request = qnext.getValue('request');
const {users, topMembers} = qnext.getValue('localVar');

function run() {
  const lines = topMembers.response.map((item, index) => {
    const user = users[item.userId];
    if (!user) return;
    const link = user.username ? 'https://t.me/'+user.username : 'tg://user?id='+item.userId;
    return (index+1)+'. ['+user.name+']('+link+') - '+item.cnt;
  })
  const content = lines.join('\n');
  exports.targets = [{
    target: '',
    datapoints: [[
      content, 0
    ]]
  }];
}

run();
// buildTopMembers
