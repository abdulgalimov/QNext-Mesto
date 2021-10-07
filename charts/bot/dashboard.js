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

const helpText = `* startAuth: Старт авторизации
* sendEmailOk: Юзер написал свою почту, ему отправлена ссылка для входа
* sendEmailErr: Юзер написал не валидную почту, ссылка для входа не отправлена
* emailOpenOk: Юзер открыл ссылку из почты, авторизация пройдена
* emailOpenErr: Юзер открыл ссылку из почты, авторизация НЕ пройдена. Протухла ссылка, либо открыл не тем telegram-аккаунтом
* rulesOk: Юзер подтвердил правила
* rulesErr: Юзер не подтвердил правила
* rulesErr: Юзер не подтвердил правила
* block: 🚫Блокировка бота юзером
* unblock: ✅Разблокировка бота юзером

## steps
Чтобы показать определенные шаги, укажите их в ссылке в параметр steps через запятую, например так
\`\`\`
https://qnext.app/bin/charts/8802/29/f44c5144b6a15d16e23f588cc1d620971a7418f5?steps=block,unblock
\`\`\`
## divider
С помощью параметра divider можно указать по какому временному промежутку группировать события,
например если надо группировать по-суточно, укажите параметр divider=24h:
\`\`\`
https://qnext.app/bin/charts/8802/29/f44c5144b6a15d16e23f588cc1d620971a7418f5?divider=24h
\`\`\`
`

dashboard.panels.push({
  "type": "text",
  "title": "",
  "gridPos": {
    "x": 0,
    "y": 12,
    "w": 24,
    "h": 15
  },
  "targets": [],
  "timeFrom": null,
  "timeShift": null,
  "options": {
    "mode": "markdown",
    "content": helpText,
  },
  "datasource": null
})

exports.dashboard = dashboard;
