const chat = qnext.getValue('targetChat');

const body = {
  chat_id: chat.id,
}
qnext.telegram.api('getChatMemberCount', body).then(res => {
  exports.membersCount = res ? res.response : null;
  qnext.onFinish();
})
