
const {user, formResult} = qnext.data;
const {givejob, jobtype, joblocation, jobscope, jobabout, type, tg} = formResult.values;
const {italic} = qnext.html;

const vacancyurl = formResult.data.vacancyurl ? formResult.data.vacancyurl.text : null;
const resumeurl = formResult.data.resumeurl ? formResult.data.resumeurl.text : null;

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
  social: {
    key: 'Социальная помощь',
    need: {
      tag: '#требуется_социальная_помощь',
    },
    can: {
      tag: '#помогу_с_социальной_помощью',
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
    key: 'Найти работу',
    can: {
      tag: '#помогу_найти_работу',
    }
  },
  givejob: {
    key: 'Найти работу',
    can: {
      tag: '#предоставлю_работу',
    }
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
  tags.push(info.givejob.can.tag);
  let title;
  switch (jobtype) {
    case 'Удаленно':
      doc['jobtype'] = 'online';
      if (requestType === 'can') {
        title = 'Готов предоставить удаленную работу';
      } else {
        title = 'Нужна удаленная работа';
      }
      break;
    case 'Локально':
      doc['jobtype'] = 'local';
      if (requestType === 'can') {
        title = 'Готов предоставить локальную работу в ' + joblocation;
      } else {
        title = 'Нужна локальная работа в ' + joblocation;
      }
      break;
  }
  if (jobscope) {
    doc['jobscope'] = jobscope.split(',');
    title = `${title}
    Сфера: ${jobscope}`;
  }
  if (jobabout) {
    doc['jobabout'] = jobabout;
    title = `${title}
    Описание: ${jobabout}`;
  }
  message += `\n${splitter}${title}`;
  //
  if (vacancyurl) {
    doc['vacancyurl'] = vacancyurl;
    const vacancyText = qnext.html.link('Ссылка на вакансию', vacancyurl);
    message += `\n${splitter}${vacancyText}.`;
  }
  if (resumeurl) {
    doc['resumeurl'] = resumeurl;
    const resumeText = qnext.html.link('Ссылка на резюме', resumeurl);
    message += `\n${splitter}${resumeText}.`;
  }
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
