
const {user, formResult} = qnext.data;
const {givejob, jobtype, joblocation, jobscope, jobabout, type, tg} = formResult.values;
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
  legal: {
    key: 'Юридическая помощь',
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
  location: {
    key: 'Местоположение',
  },
  relocation: {
    key: 'Релокация',
  },
  comments: {
    key: 'Комментарии',
  },
  findjob: {
    key: 'Найти работу'
  },
  givejob: {
    key: 'Найти работу'
  }
};

const canIcon = '🔹';
let message;
let splitter;
let tags = [];
let requestType;
switch (type) {
  case 'Могу помочь':
    message = `💙 Могу помочь.`;
    splitter = canIcon;
    requestType = 'can';
    break;
  case 'Нужна помощь':
    message = `❤️ Нужна помощь.`;
    splitter = '🔺';
    requestType = 'need';
    break;
}
const doc = {
  type: requestType,
};

function addLine(type) {
  const typeData = info[type];
  const {key} = typeData;
  const value = formResult.values[type];
  if (!value) {
    doc[type] = [];
    return;
  }
  doc[type] = value.split(',');
  message += `\n${splitter}${italic(key)}: ${value}`;
  //
  if (typeData[requestType] && typeData[requestType].tag) {
    tags.push(typeData[requestType].tag);
  }
}
addLine('location');
addLine('relocation');
addLine('housing');
addLine('psychological');
addLine('legal');
addLine('social');
addLine('medical');
addLine('findjob');

if (givejob === 'Да') {
  let title;
  switch (jobtype) {
    case 'Удаленно':
      title = 'Готов предоставить удаленную работу';
      break;
    case 'Локально':
      title = 'Готов предоставить локальную работу в '+joblocation;
      break;
  }
  if (jobscope) {
    title = `${title}
  Сфера: ${jobscope.join(', ')}`;
  }
  if (jobabout) {
    title = `${title}
  Описание: ${jobabout}`;
  }
  message += `\n${canIcon}${title}`;
}

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
exports.doc = doc;
