var _ = require("underscore");
var $ = require("jquery");

var Actions = require("../actions/Actions");
var ActionTypes = require("../constants/ActionTypes");
var AppDispatcher = require("./AppDispatcher");
var Config = require("../config/Config");

var _historyServiceOnline = true;

function getStateUrl(timeScale) {
  timeScale = timeScale || "last";
  if (_historyServiceOnline) {
    return Config.historyServer +
      "/dcos-history-service/history/" + timeScale;
  } else {
    return Config.rootUrl + "/mesos/master/state-summary";
  }
}

function registerServerError(message, type) {
  _historyServiceOnline = false;
  Actions.log({
    description: "Server error",
    type: type,
    error: message
  });
}

function request(url, type, data, options) {
  options = _.extend({
    url: url,
    dataType: "json",
    type: type
  }, options);

  // make request
  $.ajax(options);
}

var MesosStateActions = {

  fetchSummary: function (timeScale) {
    var successType = ActionTypes.REQUEST_MESOS_HISTORY_SUCCESS;
    var errorType = ActionTypes.REQUEST_MESOS_HISTORY_ERROR;

    if (timeScale == null) {
      successType = ActionTypes.REQUEST_MESOS_SUMMARY_SUCCESS;
      errorType = ActionTypes.REQUEST_MESOS_SUMMARY_ERROR;
    }

    var url = getStateUrl(timeScale);

    request(url, "GET", null, {
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: successType,
          data: response
        });
      },
      error: function (e) {
        registerServerError(e.message, errorType);
        AppDispatcher.handleServerAction({
          type: errorType,
          data: e.message
        });
      }
    });
  },

  fetchState: function () {
    var url = Config.historyServer + "/mesos/master/state.json?jsonp=?";

    request(url, "GET", null, {
        contentType: "application/json; charset=utf-8",
        dataType: "jsonp",
        success: function (response) {
          AppDispatcher.handleServerAction({
            type: ActionTypes.REQUEST_MESOS_STATE_SUCCESS,
            data: response
          });
        },
        error: function (e) {
          AppDispatcher.handleServerAction({
            type: ActionTypes.REQUEST_MESOS_STATE_ERROR,
            data: e.message
          });
        }
    });
  },

  fetchMarathonHealth: function () {
    var url = Config.rootUrl + "/marathon/v2/apps";

    request(url, "GET", null, {
      contentType: "application/json; charset=utf-8",
      crossDomain: true,
      xhrFields: {
        withCredentials: false
      },
      dataType: "json",
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_MARATHON_APPS_SUCCESS,
          data: response
        });
      },
      error: function (e) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_MARATHON_APPS_ERROR,
          data: e.message
        });
      }
    });
  }

};

module.exports = MesosStateActions;
