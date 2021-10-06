const user = qnext.getValue('user');
const exec = qnext.getValue('exec');


async function run() {
  const keyWordId = +exec[1]||0;
  if (!keyWordId) return;
  const db = await qnext.database.system();
  const query = {
    id: keyWordId,
  };
  const update = {
    $pull: {
      users: user.id,
    }
  };
  await db.collection('KeyWords').updateOne(query, update);
  await db.collection('KeyWords').deleteMany({
    users: {
      $size: 0,
    }
  });
}

run().finally(qnext.onFinish);
// DelMessage
