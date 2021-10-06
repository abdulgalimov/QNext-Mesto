const {chatId} = qnext.getValue('request.query');
const {chats} = qnext.getValue('globalVar');
const query = qnext.getValue('query');

const refId = {
  chat: query.chatId ? query.chatId : 'all',
  divider: query.divider ? query.divider : 'auto',
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
    "transparent": true
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

let dashboardTitle = 'Чаты Mesto';
if (chatId && chats[chatId]) {
  dashboardTitle = chats[chatId].title;
}
const dashboard = {
  "editable": false,
  "hideControls": true,
  "graphTooltip": false,
  "time": {
    "from": "now-${query.period| notFound: 3d}",
    "to": "now"
  },
  "title": dashboardTitle,
  "panels": []
}

dashboard.panels.push(addRow(0, "Участники"));

const membersCountStat = addStat({x: 0, w: 10, title: 'Всего'});
dashboard.panels.push(membersCountStat);
membersCountStat.targets.push({
  target: "membersCountValue",
  refId,
})

const membersLanguages = addPie({x: 10, w: 14, title: 'Языки'});
dashboard.panels.push(membersLanguages);
membersLanguages.targets.push({
  target: "membersLanguages",
  refId,
})

const membersCountPanel = addGraph({y: 10});
dashboard.panels.push(membersCountPanel);
membersCountPanel.targets.push({
  target: "membersCount",
  refId,
});

dashboard.panels.push(addRow(20, "Сообщения"));
const messagesPanel = addGraph({y: 20});
dashboard.panels.push(messagesPanel);
messagesPanel.targets.push({
  target: "messages",
  refId,
});

dashboard.panels.push(addRow(30, "Входы/Выходы"));
const joinLeft = addGraph({y:30});
dashboard.panels.push(joinLeft);
joinLeft.targets.push({
  target: "joinLeft",
  refId,
});

dashboard.panels.push({
  title: 'Топ участников',
  type: 'marcusolsson-dynamictext-panel',
  gridPos: {x: 0, y: 40, w: 24, h: 8},
  options: {
    content: "{{Value}}",
    defaultContent: "error"
  },
  targets: [{
    type: "timeserie",
    target: "topMembers",
    refId,
  }],
})

exports.dashboard = dashboard;
