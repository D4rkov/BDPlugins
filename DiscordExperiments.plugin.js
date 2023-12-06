/**
 * @name DiscordExperiments
 * @description Enables the experiments tab in discord's settings.
 * @author Darkov, Zyrenth, MeguminSama
 * @source https://github.com/D4rkov/BDPlugins/blob/main/DiscordExperiments.plugin.js
 * @version 1.0.0
 */

let cache; webpackChunkdiscord_app.push([["wp_isdev_patch"], {}, r => cache=r.c]);
var UserStore = Object.values(cache).find(m => m?.exports?.default?.getUsers).exports.default;
var actions = Object.values(UserStore._dispatcher._actionHandlers._dependencyGraph.nodes);
var user = UserStore.getCurrentUser();

module.exports = class {

  start() {
    user.flags &= ~0;
    actions.find(n => n.name === "ExperimentStore").actionHandler.CONNECTION_OPEN({
      type: "CONNECTION_OPEN", 
      user: {flags: user.flags |= 1}, 
      experiments: [],
    });
    actions.find(n => n.name === "DeveloperExperimentStore").actionHandler.CONNECTION_OPEN();
  }

  stop(){
    user.flags &= ~1;
    actions.find(n => n.name === "ExperimentStore").actionHandler.CONNECTION_OPEN({
      type: "CONNECTION_OPEN", 
      user: {flags: user.flags |= 0}, 
      experiments: [],
    });
    actions.find(n => n.name === "DeveloperExperimentStore").actionHandler.CONNECTION_OPEN();
  }
};
