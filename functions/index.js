const functions = require('firebase-functions');

const { onPullRequestHandler } = require('./on_pull_request');
const { onBuildCompleteHandler } = require('./on_build_complete');

exports.perfTest = functions.https.onRequest(onPullRequestHandler);

exports.onBuildComplete = functions.https.onRequest(onBuildCompleteHandler);