/**
 * @name DiscordExperiments
 * @description Enables the experiments tab in discord's settings.
 * @author Darkov, Zyrenth, MeguminSama
 * @source https://github.com/D4rkov/BDPlugins/blob/main/DiscordExperiments.plugin.js
 * @version 1.0.1
 */

const cache = {};
webpackChunkdiscord_app.push([["wp_isdev_patch"], {}, r => Object.assign(cache, r.c)]);
const UserStore = Object.values(cache).find(m => m?.exports?.default?.getUsers).exports.default;
const actions = Object.values(UserStore._dispatcher._actionHandlers._dependencyGraph.nodes);
const user = UserStore.getCurrentUser();

let intervalId = null;

module.exports = class {

  start() {
    if (!intervalId) {
      intervalId = setInterval(() => {
        user.flags &= ~0;
        actions.find(n => n.name === "ExperimentStore").actionHandler.CONNECTION_OPEN({
          type: "CONNECTION_OPEN", 
          user: {flags: user.flags |= 1}, 
          experiments: [],
        });
        actions.find(n => n.name === "DeveloperExperimentStore").actionHandler.CONNECTION_OPEN();
      }, 5000);
    }
  }

  stop() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    
    user.flags &= ~1;
    actions.find(n => n.name === "ExperimentStore").actionHandler.CONNECTION_OPEN({
      type: "CONNECTION_OPEN", 
      user: {flags: user.flags |= 0}, 
      experiments: [],
    });
    actions.find(n => n.name === "DeveloperExperimentStore").actionHandler.CONNECTION_OPEN();
  }

};
