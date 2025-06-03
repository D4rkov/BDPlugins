/**
 * @name DiscordExperiments
 * @description Enables the experiments tab in Discord's settings.
 * @author Darkov, Zyrenth, MeguminSama, VincentX0905(炸蝦)
 * @source https://github.com/D4rkov/BDPlugins/blob/main/DiscordExperiments.plugin.js
 * @updateUrl https://raw.githubusercontent.com/D4rkov/BDPlugins/main/DiscordExperiments.plugin.js
 * @version 1.0.2
 */

let intervalId = null;

function getUserModule() {
    let cache = webpackChunkdiscord_app.push([[Symbol()], {}, r => r.c]);
    webpackChunkdiscord_app.pop();
    return Object.values(cache).find(
        x => x?.exports?.default?.__proto__?.getUsers && x?.exports?.default?.getCurrentUser
    )?.exports?.default;
}

function getActionHandlers(userModule) {
    return userModule?._dispatcher?._actionHandlers?._dependencyGraph?.nodes
        ? Object.values(userModule._dispatcher._actionHandlers._dependencyGraph.nodes)
        : [];
}

function isExperimentsEnabled() {
    try {
        let userModule = getUserModule();
        return (userModule.getCurrentUser().flags & 1) === 1;
    } catch {
        return false;
    }
}

async function applyPatch() {
    try {
        let userModule = getUserModule();
        if (!userModule) throw new Error("User module not found");
        userModule.getCurrentUser().flags |= 1;
        const actionHandlers = getActionHandlers(userModule);
        const devExpStore = actionHandlers.find(x => x.name === "DeveloperExperimentStore");
        devExpStore?.actionHandler?.["CONNECTION_OPEN"]?.();
        try {
            actionHandlers.find(x => x.name === "ExperimentStore")
                ?.actionHandler?.["OVERLAY_INITIALIZE"]?.({ user: { flags: 1 } });
        } catch {}
        actionHandlers.find(x => x.name === "ExperimentStore")?.storeDidChange();
    } catch (error) {
        console.log(error);
        BdApi.UI.showNotice("An error occurred with the DiscordExperiments plugin", {type: "error"});
    }
}

async function revertPatch() {
    try {
        let userModule = getUserModule();
        if (!userModule) throw new Error("User module not found");
        userModule.getCurrentUser().flags &= ~1;
        const actionHandlers = getActionHandlers(userModule);
        const devExpStore = actionHandlers.find(x => x.name === "DeveloperExperimentStore");
        devExpStore?.actionHandler?.["CONNECTION_OPEN"]?.();
        try {
            actionHandlers.find(x => x.name === "ExperimentStore")
                ?.actionHandler?.["OVERLAY_INITIALIZE"]?.({ user: { flags: 0 } });
        } catch {}
        actionHandlers.find(x => x.name === "ExperimentStore")?.storeDidChange();
    } catch (error) {
        console.log(error);
        BdApi.UI.showNotice("An error occurred while reverting DiscordExperiments", {type: "error"});
    }
}

module.exports = class DiscordExperiments {
    async start() {
        await applyPatch();
        intervalId = setInterval(async () => {
            if (!isExperimentsEnabled()) {
                await applyPatch();
            }
        }, 2500);
    }

    async stop() {
        if (intervalId) clearInterval(intervalId);
        await revertPatch();
    }
}
