
const {
  name,
  contacts,
  position,
  format,
  about,
  keys,
  salary,
  currency
} = qnext.data.formResult.values;

const {
  resume_link,
} = qnext.data.formResult.data;


function parseSalary() {
  const normalized = salary
    .replaceAll(' ', '')
    .replace(',', '.');
  return normalized||0;
}

exports.doc = {
  name,
  contacts,
  position,
  format: format.split(',').map(value => value.split()),
  about,
  keys: keys.split(',').map(value => value.split()),
  resumeLink: resume_link.text,
  currency,
  salary: parseSalary(),
}
