
const {userIds, users, counts} = qnext.data.localVar;

const byId = users.reduce((data, user) => {
  data[user.id] = user;
  return data;
}, {});

const places = userIds
  .map((userId, index) => {
    const num = index + 1;
    const user = byId[userId];
    if (!user) return;
    const count = counts[userId]||0;
    const userName = qnext.html.link(user.name, qnext.urls.user(user));
    return `${num}) ${count} - ${userName}`;
  })
  .filter(line => !!line);
exports.message = places.join('\n');