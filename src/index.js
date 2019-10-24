const exec = require('./_exec');
const path = require('path');
const core = require('@actions/core');
const semanticRelease = require('semantic-release');

/**
 * Release task
 * @returns {Promise<never>}
 */
const release = async () => {
    const plugins = core.getInput('plugins', {required: false}) || '';

    if (plugins) {
        let pluginsToInstall = plugins.replace(/['"]/g, '').replace(/[\n\r]/g, ' ');
        const {stdout, stderr} = await exec(`npm install ${pluginsToInstall}`, {
            cwd: path.resolve(__dirname)
        });
        core.debug(stdout);
        if (stderr) {
            return Promise.reject(stderr);
        }
    }

    const result = await semanticRelease();

    if (!result) {
        core.setOutput('published', 'false');
        core.debug('No release published.');
        return;
    }

    const {commits, nextRelease, releases} = result;

    core.debug(`Published ${nextRelease.type} release version ${nextRelease.version} containing ${commits.length} commits.`);

    for (const release of releases) {
        core.debug(`The release was published with plugin "${release.pluginName}".`);
    }

    // set outputs
    core.setOutput('published', 'true');
    core.setOutput('version', nextRelease.version);
};


module.exports = () => {
    core.debug('Initialization successful');
    release().catch(core.setFailed);
};
