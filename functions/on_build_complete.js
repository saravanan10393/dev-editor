const fetch = require('node-fetch');

const { CHECK_STATUS, CONCLUSION } = require('./constant');
const { getApiToken }  = require('./get_api_key');

function updateGitCheckStatus({
  check_id,
  repo
}) {
  let url = `https://api.github.com/repos/${repo}/check-runs/${check_id}`;
  return fetch(url, {
    method: "PATCH",
    headers: {
      "Accept": "application/vnd.github.antiope-preview+json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: "Performance test completed",
      status: CHECK_STATUS.COMPLETED,
      conclusion: CONCLUSION.SUCCESS,
      completed_at: new Date().toISOString()
    })
  })
  .then(res => res.json())
  .then(res => console.log("=== Git check completed ===", res));
}

exports.onBuildCompleteHandler = (request, response) => {
  console.log("=== Buddy build completed ===", request.body);
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
