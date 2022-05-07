const {current} = qnext.data.localVar;

function getMonthValue(date) {
  const value = '0'+(date.getMonth()+1);
  return value.substring(-2);
}

async function run() {
  let fromDate = new Date();
  fromDate.setHours(0, 0, 0, 0);
  fromDate.setDate(1);
  fromDate.setMonth(fromDate.getMonth() - 1);
  //
  let toDate = new Date();
  toDate.setHours(0, 0, 0, 0);
  if (!current) {
    fromDate.setMonth(fromDate.getMonth() - 1);
    toDate.setDate(1);
  }
  const fromMonth = getMonthValue(fromDate);
  const toMonth = getMonthValue(toDate);
  console.log('date: ', fromDate, toDate, fromMonth, toMonth);
  const sql = `
SELECT COUNT() AS cnt, param3 as userId
FROM CustomStats
WHERE param1=2009
  AND createdDate > '${fromDate.getFullYear()}-${fromMonth}-01 00:00:00'
  AND createdDate < '${toDate.getFullYear()}-${toMonth}-01 00:00:00'
GROUP BY param3
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