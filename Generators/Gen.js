const userAgents = require('./userAgents.js');
const referers = require('./referers.js');
const ips = require('./ips.js');

function generateUserAgent() {
    let randomIndex = Math.floor(Math.random() * userAgents.list_of_userAgents.length);
    return userAgents.list_of_userAgents[randomIndex];
}

function generateReferer() {
    let randomIndex = Math.floor(Math.random() * referers.list_of_referers.length);
    return referers.list_of_referers[randomIndex];
}
function generateIP() {
    let randomIndex = Math.floor(Math.random() * ips.list_of_ips.length);
    return ips.list_of_ips[randomIndex];
}

module.exports = { generateIP, generateReferer, generateUserAgent };


