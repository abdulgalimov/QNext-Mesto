
const professionPropName = 'Target profession';
const selectedProfession = qnext.getValue(`httpResponse.value.formData.values.${professionPropName}`, {});
console.log('selectedProfession', selectedProfession);

const properties = qnext.getValue('httpResponse.value.form.schema.properties', []);
const relationProp = properties.find(propItem => propItem.propertyName === professionPropName);
console.log('relationProp', relationProp);

const notionSecret = qnext.getValue('httpResponse.value.token.value');
console.log('notionSecret', notionSecret);

const apiUrl = 'https://api.notion.com/v1';
function callNotionApi(path, method, body) {
  const url = apiUrl + path;
  const options = {
    method,
    headers: {
      'Authorization': 'Bearer ' + notionSecret,
      'Notion-Version': '2021-08-16',
      'Content-type': 'application/json',
    },
  }
  if (method === 'POST' || method === 'PATCH') {
    options.body = JSON.stringify(body);
  }
  return qnext.fetch(url, options, {type: 'json'});
}

const mentorsDatabaseId = '095d6358-5ca8-4114-a427-a007a627a984';
async function run() {
  const path = `/databases/${mentorsDatabaseId}/query`;
  const body = {
    filter: {
      and: [{
        property: 'Profession',
        relation: {
          contains: selectedProfession.value[0].id,
        }
      }]
    },
    page_size: 10,
  };
  console.log('call', JSON.stringify(body, null, 2));
  const findRes = await callNotionApi(path, 'POST', body);
  console.log('findRes', findRes);
  if (findRes.result.object === 'error') {
    console.error('Error find mentors', findRes);
    return sendMessage('Не удалось найти менторов, попробуйте позже')
  }
  await sendMessage(`Поиск менторов по професии: ${selectedProfession.name}`);
  const mentors = findRes.result.results||[];
  const tasksList = mentors.map(mentor => {
    const name = mentor.properties.Name.title[0].plain_text;
    const exp = mentor.properties.exp.number;
    const email = mentor.properties.Email.email;
    const about = mentor.properties.About.rich_text[0].plain_text;
    const currentPosition = mentor.properties['Current position'].rich_text[0].plain_text;
    const telegramContact = mentor.properties['Telegram contact'].checkbox;
    const telegramId = mentor.properties.id.number;
    const telegramUsername = mentor.properties['Telegram username'].rich_text[0].plain_text;
    //
    const contactLine = [];
    if (email) {
      contactLine.push(email);
    }
    if (telegramContact) {
      if (telegramUsername) {
        contactLine.push(`@${telegramUsername}`);
      } else {
        contactLine.push(qnext.html.link('Telegram', `tg://user?id=${telegramId}`));
      }
    }
    //
    const message = `👤${name}
Должность: ${currentPosition}
Опыт: ${exp}
О себе: ${about}
Контакты: ${contactLine.join(' ')}`;
    return sendMessage(message);
  });
  return qnext.tasks.parallel(tasksList);
}

function sendMessage(message) {
  return qnext.telegram.api('sendMessage', {
    chat_id: qnext.data.user.id,
    text: message,
  })
}

run().finally(qnext.onFinish);
