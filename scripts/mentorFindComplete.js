
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

async function run() {
  const path = `/databases/${relationProp.relationTableId}/query`;
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
  console.log('call', body);
  const findRes = await callNotionApi(path, 'POST', body);
  console.log('findRes', findRes);
}

run().finally(qnext.onFinish);
