const functions = require('firebase-functions');
const fetch = require('node-fetch');

const { CHECK_STATUS, CONCLUSION } = require('./constant');
const { getApiToken }  = require('./get_api_key');

function updateGitCheckStatus({
  apiToken,
  check_id,
  repo
}) {
  let url = `https://api.github.com/repos/${repo}/check-runs/${check_id}`;
  return fetch(url, {
    method: "PATCH",
    headers: {
      "Accept": "application/vnd.github.antiope-preview+json",
      "Content-Type": "application/json",
      "Authorization": "token "+apiToken
    },
    body: JSON.stringify({
      name: "Page speed test",
      status: CHECK_STATUS.COMPLETED,
      conclusion: CONCLUSION.SUCCESS,
      completed_at: new Date().toISOString(),
      output: {
        title: "Ran a webpage test",
        summary: "**Lighthouse perf test results **",
        text: "** Performance: 90 ** "
      }
    })
  })
  .then(res => res.json())
  .then(res => {
    console.log("=== updated the git check to completed ===", res);
    return res;
  });
}

function getLightHouseScore() {
 let url = "http://www.webpagetest.org/runtest.php";
 fetch(url, {
   method: "POST",
   headers: {
     'Content-Type': "application/json"
   },
   body: JSON.stringify({
    url: "https://dev-editor-test.web.app/",
    runs: 1,
    f: "json",
    k: functions.config().webpagetest.key,
    lighthouse: 1,
    fvonly: 1,
    pingback: "https://us-central1-dev-editor-9fe5b.cloudfunctions.net/onLoadTestDone"
   })
 })
 .then(res => res.text())
 .then((res) => {
    return console.info("=== triggered webpage test api test === ", res);
 })
 .catch(err => {
  console.info("=== Failed to initiated webpage test call ===", err);
 });
}

exports.onLoadTestDone = (request, response) => {
  console.log("=== completed webpage test id ===", request.query, request.query.id);
  response.end("");
}

exports.onBuildCompleteHandler = (request, response) => {
  console.log("=== Buddy build completed ===", request.body);
  getLightHouseScore();
  return getApiToken()
  .then(token => {
    console.info("== Api token ==", token);
    return updateGitCheckStatus({
      apiToken: token,
      check_id: request.body.check_id,
      repo: request.body.repo
    });
  })
  .then(res => {
    console.log("=== completed the git check ===", res);
    return response.send("Git check completed")
  })
  .catch(err => {
    console.error("=== Failed to complete git check ===", err);
    return response.status(500).send("Failed to update git check");
  });  
}
