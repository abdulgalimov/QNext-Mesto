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
  exports.block = block;
  targets.push(getTarget('Старт авторизации', result.startAuth));
  targets.push(getTarget('Юзер написал свою почту, ему отправлена ссылка для входа', result.sendOkEmail));
  targets.push(getTarget('Юзер написал не валидную почту, ссылка для входа не отправлена', result.sendErrEmail));
  targets.push(getTarget('Юзер открыл ссылку из почты, авторизация пройдена', result.emailOpenOk));
  targets.push(getTarget('Юзер открыл ссылку из почты, авторизация НЕ пройдена. Протухла ссылка, либо открыл не тем telegram-аккаунтом.', result.emailOpenErr));
  targets.push(getTarget('Юзер подтвердил правила', result.rulesOk));
  targets.push(getTarget('Юзер не подтвердил правила', result.rulesErr));
  targets.push(getTarget('🚫Блокировка бота юзером', result.block));
  targets.push(getTarget('✅Разблокировка бота юзером', result.unblock));
  exports.targets = targets;
}

function getTarget(name, data) {
  const datapoints = data.result.response.map(item => {
    return [item.value, item.time];
  });
  return {
    target: name,
    datapoints
  }
}

run().finally(qnext.onFinish);
