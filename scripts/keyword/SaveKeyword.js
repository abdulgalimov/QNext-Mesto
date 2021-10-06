const user = qnext.getValue('user');
let text = qnext.getValue('triggerValue');

async function run() {
  if (!text || text.length < 4) return;
  const db = await qnext.database.system();
  //
  text = text.toLowerCase();
  const query = {
    text,
  }
  const id = await getNextSequence(db, 'KeyWords');
  const update = {
    $setOnInsert: {
      id,
      text,
    },
    $addToSet: { users: user.id },
  }
  const options = {
    upsert: true,
  }
  await db.collection('KeyWords').updateOne(query, update, options);
}

async function createIndex(db, name) {
  const ids = db.collection('IdContainer');
  const res = await ids.findOne({_id: name});
  if (!res) {
    return ids.insertOne({
      _id: name,
      seq: 1
    })
  }
}
async function getNextSequence(db, name, count=1) {
  await createIndex(db, name)
  const ids = db.collection('IdContainer');
  const ret = await ids.findOneAndUpdate({
    _id: name
  }, {
    $inc: { seq: count }
  });
  return ret.value.seq - count + 1;
}

run().catch((err) => {
  console.error(err.messages, err.stack);
}).finally(qnext.onFinish);
// SaveKeyword
