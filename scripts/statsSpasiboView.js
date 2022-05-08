
const {userIds, users, counts, dateView} = qnext.data.localVar;

const byId = users.reduce((data, user) => {
  data[user.id] = user;
  return data;
}, {});

let num = 1;
const places = userIds
  .map(userId => {
    const user = byId[userId];
    if (!user) return;
    const count = counts[userId]||0;
    const userName = qnext.html.link(user.name, qnext.urls.user(user));
    return `${num++}) ${count} - ${userName}`;
  })
  .filter(line => !!line);
exports.message = `Спасибо за период:
${dateView}

${places.join('\n')}`;