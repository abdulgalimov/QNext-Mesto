
const {user, formResult} = qnext.data;
const {type, housing, psychological, documents, humanitarian, medical, transport, tg, contacts} = formResult.values;
const {italic} = qnext.html;

let message;
switch (type) {
  case 'Могу помочь':
    buildCanHelp();
    break;
  case 'Нужна помощь':
    buildNeedHelp();
    break;
}

function addLine(key, value) {
  if (!value) return;
  message += `\n${italic(key)}: ${value}`;
}
function buildCanHelp() {
  message = `💙 Могу помочь.`;
  addLine('С жильем', housing);
  addLine('Психологическая помощь', psychological);
  addLine('Документы и юридическая помощь', documents);
  addLine('Гуманитарная помощь', humanitarian);
  addLine('Медицинская помощь', medical);
  addLine('Транспортная помощь', transport);
  addLine('Контакты', contacts);
}

function buildNeedHelp() {
  message = `❤️ Нужна помощь.`;
  addLine('С жильем', housing);
  addLine('Психологическая помощь', psychological);
  addLine('Документы и юридическая помощь', documents);
  addLine('Гуманитарная помощь', humanitarian);
  addLine('Медицинская помощь', medical);
  addLine('Транспортная помощь', transport);
  addLine('Контакты', contacts);
}

if (tg === 'Да') {
  message = `${message}
${qnext.urls.user(user)}`
}


exports.message = message;
