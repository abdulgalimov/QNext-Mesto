
const {user, formResult} = qnext.data;
const {type, housing, psychological, documents, humanitarian, medical, transport, tg, contacts} = formResult.values;
const {italic} = qnext.html;

const info = {
  housing: {
    key: 'С жильем',
    tag: '#жилье'
  },
  psychological: {
    key: 'Психологическая помощь',
    tag: '#психологическая_помощь'
  },
  documents: {
    key: 'Документы и юридическая помощь',
    tag: '#документы #юридическая_помощь'
  },
  humanitarian: {
    key: 'Гуманитарная помощь',
    tag: '#гуманитарная_помощь'
  },
  medical: {
    key: 'Медицинская помощь',
    tag: '#медицинская_помощь'
  },
  transport: {
    key: 'Транспортная помощь',
    tag: '#транспортная_помощь'
  },
  contacts: {
    key: 'Контакты',
  }
};

let message;
let splitter;
let tags = [];
switch (type) {
  case 'Могу помочь':
    message = `💙 Могу помочь.`;
    splitter = '🔵';
    break;
  case 'Нужна помощь':
    message = `❤️ Нужна помощь.`;
    splitter = '🔴';
    break;
}

function addLine(type) {
  const typeData = info[type];
  const {key, tag} = typeData;
  const value = formResult.values[type];
  if (!value) return;
  message += `\n${splitter}${italic(key)}: ${value}`;
  if (tag) tags.push(tag);
}
addLine('housing');
addLine('psychological');
addLine('documents');
addLine('humanitarian');
addLine('medical');
addLine('transport');
addLine('contacts');

if (tg === 'Да') {
  message = `${message}
${qnext.urls.user(user)}`
}

if (tags.length) {
  message = `${message}

${tags.join(' ')}`
}


exports.message = message;
