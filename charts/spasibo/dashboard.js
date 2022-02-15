const query = qnext.getValue('query');
const user = qnext.data.localVar.user;

const refId = {
  chat: query.chatId ? query.chatId : 'all',
  divider: query.divider ? query.divider : 'auto',
  userId: user ? user.id :0,
}

let idCount = 1;
function addGraph(options) {
  const x = options.x||0;
  const y = options.y||0;
  const w = options.w||24;
  const h = options.h||10;
  return {
    "datasource": "qnext",
    "gridPos": {x, y, w, h},
    "id": idCount++,
    "maxDataPoints": 1,
    "targets": [],
    "timeFrom": null,
    "timeShift": null,
    "title": "",
    "type": "graph",
    "transparent": true,
    "yaxes": [
      {
        "format": "none",
        "label": null,
        "logBase": 1,
        "max": null,
        "min": null,
        "show": true
      },
      {
        "format": "none",
        "label": null,
        "logBase": 1,
        "max": null,
        "min": null,
        "show": true
      }
    ],
  };
}
function addRow(y, title) {
  return {
    "type": "row",
    "title": title,
    "gridPos": {
      "x": 0,
      "y": y,
      "w": 0,
      "h": 0
    }
  }
}
function addStat(options) {
  const x = options.x||0;
  const y = options.y||0;
  const w = options.w||24;
  const h = options.h||10;
  return {
    title: options.title,
    "datasource": "qnext",
    "gridPos": {x, y, w, h},
    "id": idCount++,
    "maxDataPoints": 1,
    "targets": [],
    "timeFrom": null,
    "timeShift": null,
    "type": "stat",
    "transparent": true,
    options: {
      textMode: 'value',
    },
    "fieldConfig": {
      "defaults": {
        "thresholds": {
          "mode": "absolute",
          "steps": [
            {
              "value": 0,
              "color": "green"
            }
          ]
        },
      },
    },
  };
}
function addPie(options) {
  const x = options.x||0;
  const y = options.y||0;
  const w = options.w||24;
  const h = options.h||10;
  return {
    title: options.title,
    "datasource": "qnext",
    "targets": [],
    "type": "grafana-piechart-panel",
    "gridPos": {x, y, w, h},
    "legend": {
      "show": true,
      "percentage": true,
      "value": true
    },
    "transparent": true,
    "legendType": "Right side"
  }
}

let dashboardTitle = 'Чат Spasibo';
if (user) {
  dashboardTitle += '👤'+user.name + (user.username ? '@'+user.username : '');
}
const dashboard = {
  "editable": false,
  "hideControls": true,
  "graphTooltip": false,
  "time": {
    "from": "now-"+(query.period||'7d'),
    "to": "now"
  },
  "title": dashboardTitle,
  "panels": []
}

const totalCount = addStat({x: 0, w: 12, title: 'Всего Spasibo'});
dashboard.panels.push(totalCount);
totalCount.targets.push({
  target: "totalCount",
  refId,
})

const totalUsers = addStat({x: 12, w: 12, title: 'Всего Пользователей'});
dashboard.panels.push(totalUsers);
totalUsers.targets.push({
  target: "totalUsers",
  refId,
})

const membersCountPanel = addGraph({y: 10});
dashboard.panels.push(membersCountPanel);
membersCountPanel.targets.push({
  target: "graphCount",
  refId,
});

const helpPanel = {
  "type": "text",
  "title": "",
  "gridPos": {
    "x": 0,
    "y": 20,
    "w": 24,
    "h": 12
  },
  "targets": [],
  "timeFrom": null,
  "timeShift": null,
  "options": {
    "mode": "markdown",
    "content": '',
  },
  "datasource": null
};
dashboard.panels.push(addRow(48, "Помощь"));
dashboard.panels.push(helpPanel);

async function run() {
  try {
    const helpText = await qnext.git.readFile(3, 'charts/spasibo/help.md', 'text');
    exports.helpText = helpText;
    helpPanel.options.content = helpText.ok ? helpText.response.content : '';
  } catch (err) {
    exports.errMessage = err.message;
  }
}

run().finally(qnext.onFinish);

exports.dashboard = dashboard;
