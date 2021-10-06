/**
 * generalTrigger -> DashboardFillHead
 */

const targetData = qnext.getValue("requestBody.targets.0", {});
const {refId, target} = targetData;
const dateFrom = new Date(qnext.getValue("requestBody.range.from", new Date()));
const dateTo = new Date(qnext.getValue("requestBody.range.to", new Date()));
const rangeRaw = qnext.getValue("requestBody.range.raw");

const {chat, divider: dividerSource} = refId;
exports.refData = refId;

const timeFrom = Math.floor(dateFrom.getTime()/1000);
const timeTo = Math.floor(dateTo.getTime()/1000);

let dividerSec = 0;
if (dividerSource !== 'auto') {
  const reg = /^(\d+)(h|m)$/;
  const exec = reg.exec(dividerSource);
  if (exec) {
    switch (exec[2]) {
      case 'h':
        dividerSec = +exec[1] * 3600;
        break;
      case 'm':
        dividerSec = +exec[1] * 60;
        break;
    }
  }
}
dividerSec = dividerSec||getAutoDivider();
function getAutoDivider() {
  if (timeTo - timeFrom > 7 * 24 * 3600) {
    return 24 * 3600;
  } else if (timeTo - timeFrom > 6 * 3600) {
    return 3600;
  } else {
    return 60;
  }
}

const whereTime = [
  'toUInt32(createdDate) > '+timeFrom,
  'toUInt32(createdDate) < '+timeTo,
];


exports.viewChat = chat;
exports.where = {
  time: whereTime.join(' AND ')+' AND ',
  chat: chat !== 'all' ? ' AND param2='+chat : ''
};
exports.target = target;
exports.timeFrom = timeFrom;
exports.timeTo = timeTo;
exports.divider = dividerSec;

exports.dynamicVarId = qnext.crypto.md5(rangeRaw.from+'_'+rangeRaw.to+'_'+JSON.stringify(refId));
