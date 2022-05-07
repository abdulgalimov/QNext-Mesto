const {current} = qnext.data.localVar

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
  console.log('date: ', fromDate, toDate);
  const sql = `
SELECT COUNT() AS cnt, param3 as userId
FROM stats
WHERE param1=2009
  AND createdDate > '${fromDate.getFullYear()}-${fromDate.getMonth()+1}-01 00:00:00'
  AND createdDate < '${toDate.getFullYear()}-${toDate.getMonth()+1}-01 00:00:00'
GROUP BY param3
ORDER BY cnt DESC
LIMIT 10`;
  const result = await qnext.customStats.readSql(sql);
  console.log('result', result);
}

run().finally(qnext.onFinish);