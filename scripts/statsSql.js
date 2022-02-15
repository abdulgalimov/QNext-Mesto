
let text = qnext.getValue('update.message.text', '');

const reg = /^select\s+(?<who>[^;]+)\s+from\s+stats\s+where\s+(?<where>[^;]+);?$/ig;
const ignoreKeys = {
  botId: 1,
  version: 1,
};
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
  if (result.ok) {
    if (!result.response.length) {
      exports.message = 'пусто';
      return;
    }
    const spaces = [];
    const keys = Object
      .keys(result.response[0])
      .filter(key => !ignoreKeys[key])
      .map(key => {
        spaces.push(key.length);
        return key;
      });
    const lines = [keys];
    let values = result.response;
    if (values.length > 20) values = values.slice(0, 20);
    values.map(item => {
      const line = keys.map((key, index) => {
        const value = item[key]
        spaces[index] = Math.max(spaces[index], (''+value).length);
        return value;
      })
      lines.push(line);
    })
    console.log('values', keys, spaces, lines);
  }

}

run().finally(qnext.onFinish);
