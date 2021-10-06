const query = qnext.getValue('query');

const refId = {
  divider: query.divider ? query.divider : 'auto',
  steps: query.steps,
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
    "legend": {
      "avg": false,
      "current": false,
      "max": false,
      "min": false,
      "show": true,
      "total": false,
      "values": false,
      "rightSide": true
    },
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
  const h = options.h||12;
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

let dashboardTitle = 'Бот Mesto';
const dashboard = {
  "editable": false,
  "hideControls": true,
  "graphTooltip": false,
  "time": {
    "from": "now-"+(query.period||'3d'),
    "to": "now"
  },
  "title": dashboardTitle,
  "panels": []
}

dashboard.panels.push(addRow(0, "Авторизация"));
const authPanel = addGraph({y: 0});
dashboard.panels.push(authPanel);
authPanel.targets.push({
  target: "auth",
  refId,
});

dashboard.panels.push({
  "type": "text",
  "title": "Panel Title",
  "gridPos": {
    "x": 0,
    "y": 12,
    "w": 24,
    "h": 9
  },
  "targets": [],
  "timeFrom": null,
  "timeShift": null,
  "options": {
    "mode": "markdown",
    "content": ' * startAuth: Старт авторизации\n'
      + '* sendOkEmail: Юзер написал свою почту, ему отправлена ссылка для входа\n'
      + '* sendErrEmail: Юзер написал не валидную почту, ссылка для входа не отправлена\n'
      + '* emailOpenOk: Юзер открыл ссылку из почты, авторизация пройдена\n'
      + '* emailOpenErr: Юзер открыл ссылку из почты, авторизация НЕ пройдена. Протухла ссылка, либо открыл не тем telegram-аккаунтом.\n'
      + '* rulesOk: Юзер подтвердил правила.\n'
      + '* rulesErr: Юзер не подтвердил правила.\n'
      + '* block: 🚫Блокировка бота юзером.\n'
      + '* unblock: ✅Разблокировка бота юзером.\n\n'
      + '``` \nЧтобы показать определенные шаги, укажите их в ссылке в параметр steps через запятую, например так:\n\n'
      + 'https://qnext.app/bin/charts/8802/29/f44c5144b6a15d16e23f588cc1d620971a7418f5?steps?block,unblock\n```'
  },
  "datasource": null
})

exports.dashboard = dashboard;
