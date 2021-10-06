const {divider, where} = qnext.getValue('localVar');

const targets = [];
function createSql(param1) {
  const options = {
    select: 'count() as value, (intDiv(toUInt32(createdDate), '+divider+') * '+divider+') * 1000 as time',
    where: where.time + ' param1 = '+param1,
    group: 'time',
    order: 'time'
  }
  return qnext.customStats.read(options);
}
async function run() {
  const result = await qnext.tasks.parallel({
    block: createSql(4),
    unblock: createSql(5),
    startAuth: createSql(1001),
    sendOkEmail: createSql(1003),
    sendErrEmail: createSql(1004),
    emailOpenOk: createSql(1005),
    emailOpenErr: createSql(1006),
    rulesOk: createSql(1007),
    rulesErr: createSql(1008),
  });
  getTarget('Старт авторизации', result.startAuth);
  getTarget('Юзер написал свою почту, ему отправлена ссылка для входа', result.sendOkEmail);
  getTarget('Юзер написал не валидную почту, ссылка для входа не отправлена', result.sendErrEmail);
  getTarget('Юзер открыл ссылку из почты, авторизация пройдена', result.emailOpenOk);
  getTarget('Юзер открыл ссылку из почты, авторизация НЕ пройдена. Протухла ссылка, либо открыл не тем telegram-аккаунтом.', result.emailOpenErr);
  getTarget('Юзер подтвердил правила', result.rulesOk);
  getTarget('Юзер не подтвердил правила', result.rulesErr);
  getTarget('🚫Блокировка бота юзером', result.block);
  getTarget('✅Разблокировка бота юзером', result.unblock);
  //
  exports.targets = targets;
}

function getTarget(name, data) {
  if (!data);
  const datapoints = data.result.response.map(item => {
    return [item.value, item.time];
  });
  targets.push({
    target: name,
    datapoints
  });
}

run().finally(qnext.onFinish);
