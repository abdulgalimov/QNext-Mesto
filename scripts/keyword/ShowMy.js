const user = qnext.getValue('user');

const splitterIcon = '🔸';
const delIcon = '🗑';
const delLink = 't.me/MestoInfoBot?start=delword$keyWordId';
async function run() {
  const db = await qnext.database.system();
  const myList = await db.collection('KeyWords').find({users: user.id}).toArray();
  if (!myList.length) {
    exports.messages = 'Нет сохраненных ключевых слов';
    return
  }
  const textLines = myList.map(keyWord => {
    const delUrl = delLink.replace('$keyWordId', keyWord.id);
    return keyWord.text +'  '+qnext.html.link(delIcon+'Удалить', delUrl);
  })
  exports.messages = splitterIcon+textLines.join('\n'+splitterIcon)
}

run().finally(qnext.onFinish);
// ShowMy
