/*
 * actions that can be sent to Flux store
 */
'use strict';

var constants = require('./constants.js');

var actions = {
  addTabWindow: function(tabWindow) {
    var payload = { tabWindow: tabWindow };
    this.dispatch(constants.ADD_TAB_WINDOW, payload);
  },

  closeTabWindow: function(tabWindow) {
    var payload = { tabWindow: tabWindow };
    this.dispatch(constants.CLOSE_TAB_WINDOW, payload);
  },

  revertTabWindow: function(tabWindow) {
    var payload = { tabWindow: tabWindow };
    this.dispatch(constants.REVERT_TAB_WINDOW, payload);
  },

  removeTabWindow: function(tabWindow) {
    var payload = { tabWindow: tabWindow };
    this.dispatch(constants.REMOVE_TAB_WINDOW, payload);
  },

  openTabWindow: function(tabWindow) {
    var payload = { tabWindow: tabWindow };
    this.dispatch(constants.OPEN_TAB_WINDOW, payload);
  },

  // associate a Chrome window with a given tabWindow:
  attachChromeWindow: function(tabWindow,chromeWindow) {
    var payload = { tabWindow: tabWindow, chromeWindow: chromeWindow };
    this.dispatch(constants.ATTACH_CHROME_WINDOW, payload);
  }
};

module.exports = actions;