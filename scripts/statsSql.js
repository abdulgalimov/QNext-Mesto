
let text = qnext.getValue('update.message.text', '');

const reg = /^select\s+(?<who>[^;]+)\s+from\s+stats\s+where\s+(?<where>[^;]+);?$/ig;
async function run() {
  if (!text) {
    exports.error = true;
    return;
  }
  //
  const exec = reg.exec(text);
  console.log('exec', exec);
  if (!exec) {
    exports.error = true;
    return;
  }
  const {who, where} = exec.groups;
  //
  const sql = `SELECT ${who} FROM CustomStats WHERE botId=8802 and version=3 AND ${where}`;
  const result = await qnext.customStats.readSql(sql);
  console.log('result', sql, result);

}

run().finally(qnext.onFinish);
