const options = qnext.triggerValue
  .split(';')
  .reduce((data, line) => {
    const [k, v] = line.split('=');
    data[k] = v;
  }, {});

console.log('options', options);

const current = options.current === 1;
let userParamName;
switch (options.target) {
  case 'author':
    userParamName = 'param3';
    break;
  case 'target':
    userParamName = 'param4';
    break;
}

function getMonthValue(date) {
  const value = '0'+(date.getMonth()+1);
  return value.substring(-2);
}

async function run() {
  let fromDate = new Date();
  fromDate.setHours(0, 0, 0, 0);
  fromDate.setDate(1);
  //
  let toDate = new Date();
  if (!current) {
    fromDate.setMonth(fromDate.getMonth() - 1);
    toDate.setHours(0, 0, 0, 0);
    toDate.setDate(1);
  }
  const fromMonth = getMonthValue(fromDate);
  const toMonth = getMonthValue(toDate);
  const sql = `
SELECT COUNT() AS cnt, ${userParamName} as userId
FROM CustomStats
WHERE param1=2009
  AND createdDate > '${fromDate.getFullYear()}-${fromMonth}-01 00:00:00'
  AND createdDate < '${toDate.getFullYear()}-${toMonth}-01 00:00:00'
GROUP BY ${userParamName}
ORDER BY cnt DESC
LIMIT 10`;
  const result = await qnext.customStats.readSql(sql);
  if (result.ok) {
    const userIds = [];
    const counts = {};
    result.response.map(({userId, cnt}) => {
      userIds.push(userId);
      counts[userId] = cnt;
    });
    exports.userIds = userIds;
    exports.counts = counts;
  }
}

run().finally(qnext.onFinish);