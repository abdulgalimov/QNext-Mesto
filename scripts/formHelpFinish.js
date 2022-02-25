
const {user, formResult} = qnext.data;
const {type, tg} = formResult.values;
const {italic} = qnext.html;

const info = {
  housing: {
    key: 'С жильем',
    need: {
      tag: '#требуется_жилье',
    },
    can: {
      tag: '#помогу_с_жильем',
    }
  },
  psychological: {
    key: 'Психологическая помощь',
    need: {
      tag: '#требуется_психологическая_помощь',
    },
    can: {
      tag: '#помогу_с_психологической_помощью',
    }
  },
  documents: {
    key: 'Документы и юридическая помощь',
    need: {
      tag: '#требуется_юридическая_помощь',
    },
    can: {
      tag: '#помогу_с_юридической_помощью',
    }
  },
  humanitarian: {
    key: 'Гуманитарная помощь',
    need: {
      tag: '#требуется_гуманитарная_помощь',
    },
    can: {
      tag: '#помогу_с_гуманитарной_помощью',
    }
  },
  medical: {
    key: 'Медицинская помощь',
    need: {
      tag: '#требуется_медицинская_помощь',
    },
    can: {
      tag: '#помогу_с_медицинской_помощью',
    }
  },
  transport: {
    key: 'Транспортная помощь',
    need: {
      tag: '#требуется_транспортная_помощь',
    },
    can: {
      tag: '#помогу_с_транспортом',
    }
  },
  contacts: {
    key: 'Контакты',
  },
  location: {
    key: 'Местоположение',
  },
  comments: {
    key: 'Комментарии',
  }
};

let message;
let splitter;
let tags = [];
let requestType;
switch (type) {
  case 'Могу помочь':
    message = `💙 Могу помочь.`;
    splitter = '🔹';
    requestType = 'can';
    break;
  case 'Нужна помощь':
    message = `❤️ Нужна помощь.`;
    splitter = '🔺';
    requestType = 'need';
    break;
}

function addLine(type) {
  const typeData = info[type];
  const {key} = typeData;
  const value = formResult.values[type];
  if (!value) return;
  message += `\n${splitter}${italic(key)}: ${value}`;
  //
  if (typeData[requestType] && typeData[requestType].tag) {
    tags.push(typeData[requestType].tag);
  }
}
addLine('housing');
addLine('psychological');
addLine('documents');
addLine('humanitarian');
addLine('medical');
addLine('transport');
addLine('location');
addLine('contacts');
addLine('comments');

if (tg === 'Да') {
  const userText = qnext.html.link(user.name, qnext.urls.user(user));
  message = `${message}
${userText}`;
}

if (tags.length) {
  message = `${message}

${tags.join(' ')}`
}


exports.message = message;
