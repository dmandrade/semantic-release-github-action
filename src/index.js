const exec = require('@actions/exec');
const core = require('@actions/core');
const semanticRelease = require('semantic-release');

/**
 * Release task
 * @returns {Promise<never>}
 */
const release = async () => {
    const plugins = core.getInput('plugins', {required: false}) || '';

    if (plugins) {
        let pluginsToInstall = plugins.replace(/['"]/g, '').replace(/[\n\r]/g, ' ').split(" ");

        const options = {
            failOnStdErr: true,
        };
        await exec.exec('npm install', pluginsToInstall, options);
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
