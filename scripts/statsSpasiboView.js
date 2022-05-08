
const {userIds, users, counts, titleView} = qnext.data.localVar;

const byId = users.reduce((data, user) => {
  data[user.id] = user;
  return data;
}, {});

let num = 1;
const places = userIds
  .map(userId => {
    const user = byId[userId];
    if (!user) return;
    const numView = ('0'+(num++)).substring(-2);
    const count = counts[userId]||0;
    const userName = qnext.html.link(user.name, qnext.urls.user(user));
    return `${numView}) ${count} - ${userName}`;
  })
  .filter(line => !!line);
exports.message = `${titleView}

${places.join('\n')}`;