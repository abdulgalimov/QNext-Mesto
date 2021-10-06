const query = qnext.getValue('query');

const refId = {
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

let dashboardTitle = 'Бот Mesto';
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

dashboard.panels.push(addRow(0, "Авторизация"));
const authPanel = addGraph({y: 0});
dashboard.panels.push(authPanel);
authPanel.targets.push({
  target: "auth",
  refId,
});

exports.dashboard = dashboard;
