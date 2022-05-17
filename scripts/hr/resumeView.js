
const {dataValue} = qnext.data;

const {
  name,
  contacts,
  position,
  format,
  about,
  keys,
  resumeLink,
  currency,
  salary,
} = dataValue.fields;

let view = `Резюме ${position}
${about}

Зарплатные ожидания: ${salary}${currency}
Ключевые навыки: ${keys}
Формат работы: ${format}
Контакты: ${contacts}`
if (resumeLink) {
  view = `${view}
${qnext.html.link('Ссылка на резюме.', resumeLink)}`;
}
exports.resumeView = view;
