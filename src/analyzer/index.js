const { detectCircularDeps_DFS } = require('./circularDeps/DFS');
const { detectCircularDeps_Kahn } = require('./circularDeps/Kahn');

module.exports = {
    detectCircularDeps_DFS,
    detectCircularDeps_Kahn
}