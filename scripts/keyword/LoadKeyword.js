
async function run() {
  const db = await qnext.database.system();
  const keyWords = await db.collection('KeyWords').find().toArray();
  const result = {};
  keyWords.map(keyWord => {
    result[keyWord.text] = keyWord.users;
  })
  exports.keyWords = result;
}

run().finally(qnext.onFinish);
