const update = qnext.getValue('update');
const serviceMessage = qnext.getValue('serviceMessage');

const TelegramPosterId = 777000;

const Actions = {
  BOT_MESSAGE: 1,
  INLINE_QUERY: 2,
  INLINE_CHOSEN: 3,
  USER_BAN_BOT: 4,
  USER_UNBAN_BOT: 5,

  CHAT_JOIN: 2001,
  CHAT_LEFT: 2002,
  CHAT_MESSAGE: 2003,
  VOICE_CHAT_STARTED: 2004,
  VOICE_CHAT_ENDED: 2005,
  VOICE_CHAT_SCHEDULED: 2006,
  CHANNEL_POST_COMMENT: 2007,
}
let action = 0;
let param4 = 0;
function run() {
  if (serviceMessage) {
    runServiceMessage();
  } else {
    if (update) {
      const {inline_query, chosen_inline_result, message, my_chat_member} = update;
      if (message) {
        const {chat, from, reply_to_message} = message;
        if (from && from.id === TelegramPosterId) return;
        //
        if (chat) {
          if (chat.id < 0) {
            if (reply_to_message && reply_to_message.from && reply_to_message.from.id === TelegramPosterId) {
              action = Actions.CHANNEL_POST_COMMENT;
              param4 = reply_to_message.forward_from_message_id||0;
            } else {
              action = Actions.CHAT_MESSAGE;
            }
          } else {
            action = Actions.BOT_MESSAGE;
          }
        }
      } else if (inline_query) {
        action = Actions.INLINE_QUERY;
      } else if (chosen_inline_result) {
        action = Actions.INLINE_CHOSEN;
      } else if (my_chat_member) {
        runMyChatMember(my_chat_member);
      }
    }
  }
}

function runServiceMessage() {
  switch (serviceMessage.name) {
    case 'newChatMembers':
      action = Actions.CHAT_JOIN;
      break;
    case 'leftChatMember':
      action = Actions.CHAT_LEFT;
      break;
    case 'voiceChatStarted':
      action = Actions.VOICE_CHAT_STARTED;
      break;
    case 'voiceChatEnded':
      action = Actions.VOICE_CHAT_ENDED;
      break;
    case 'voiceChatScheduled':
      action = Actions.VOICE_CHAT_SCHEDULED;
      break;
  }
}

function runMyChatMember(myChatMember) {
  const {old_chat_member, new_chat_member, chat} = myChatMember;
  if (chat.id <= 0) return;
  if (new_chat_member.status === 'kicked' && old_chat_member.status === 'member') {
    action = Actions.USER_BAN_BOT;
  }
  if (old_chat_member.status === 'kicked' && new_chat_member.status === 'member') {
    action = Actions.USER_UNBAN_BOT;
  }
}

run();
exports.statsAction = action;
exports.statsParam4 = param4;
