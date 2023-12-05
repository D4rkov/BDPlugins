/**
 * @name DiscordExperiments
 * @description Enables the experiments tab in discord's settings.
 * @author Darkov, Zyrenth, MeguminSama
 * @source https://github.com/D4rkov/BDPlugins/blob/main/DiscordExperiments.plugin.js
 */

let cache; webpackChunkdiscord_app.push([["wp_isdev_patch"], {}, r => cache=r.c]);
var UserStore = Object.values(cache).find(m => m?.exports?.default?.getUsers).exports.default;
var actions = Object.values(UserStore._dispatcher._actionHandlers._dependencyGraph.nodes);
var user = UserStore.getCurrentUser();

module.exports = class {
  getName(){
    return "Discord Experiments";
  }

  start() {
    actions.find(n => n.name === "ExperimentStore").actionHandler.CONNECTION_OPEN({
      type: "CONNECTION_OPEN", 
      user: {flags: user.flags |= 1}, 
      experiments: [],
    });
    actions.find(n => n.name === "DeveloperExperimentStore").actionHandler.CONNECTION_OPEN();
    webpackChunkdiscord_app.pop(); 
    user.flags &= ~1; 
    return "Experiments Enabled";
  }

  stop(){
    actions.find(n => n.name === "ExperimentStore").actionHandler.CONNECTION_OPEN({
      type: "CONNECTION_OPEN", 
      user: {flags: user.flags |= 0}, 
      experiments: [],
    });
    actions.find(n => n.name === "DeveloperExperimentStore").actionHandler.CONNECTION_OPEN();
    webpackChunkdiscord_app.pop(); 
    user.flags &= ~0; 
    return "Experiments Disabled";
  }
};
