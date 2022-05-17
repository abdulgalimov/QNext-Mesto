
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

function formatSalary() {
  return (''+salary)
    .split('')
    .reverse()
    .join('')
    .replaceAll(/(\d{3})/g, '$1 ')
    .trim()
    .split('')
    .reverse()
    .join('')
}

let view = `Резюме ${position}
${about}
Ключевые навыки: ${keys.join(', ')}
Формат работы: ${format.join(', ')}

Имя: ${name}
Контакты: ${contacts}
${formatSalary()} ${currency}`
if (resumeLink) {
  view = `${view}
${qnext.html.link('Ссылка на резюме.', resumeLink)}`;
}
exports.resumeView = view;
