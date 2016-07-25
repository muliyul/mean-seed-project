/**
 * Created by muliyul on 18-Jul-16.
 */
const environments = require('./environments');
const currentEnv = 'prod';


module.exports = {
    mode: currentEnv,
    baseUrl: environments[currentEnv],
    auth: require('./auth'),
    database: require('./db'),
    env: environments,
    keys: require('./keys')
};