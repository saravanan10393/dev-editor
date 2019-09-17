const functions = require('firebase-functions');
const fetch = require('node-fetch');

const { CHECK_STATUS } = require('./constant');
const { getApiToken } = require('./get_api_key');

function createGitCheck({
  apiToken,
  repo,
  commitSha
}) {
  let url = `https://api.github.com/repos/${repo}/check-runs`;
  console.info("===creating check===");
  return fetch(url, {
    method: "POST",
    headers: {
      "Accept": "application/vnd.github.antiope-preview+json",
      "Content-Type": "application/json",
      "Authorization": "token "+apiToken
    },
    body: JSON.stringify({
      name: "Page speed test",
      head_sha: commitSha,
      status: CHECK_STATUS.IN_PROGRESS,
      started_at: new Date().toISOString()
    })
  })
  .then(res => {
    let check = res.json();
    console.info("=== created check ===", check);
    return check;
  })
  .catch(err => {
    console.error("=== failed to create check ===", err);
    return Promise.reject(err);
  });
}

function triggerBuild({
  gitUrl,
  gitBranch,
  checkId,
  repo
}) {
  console.log("==== trigger perf build in buddy.works ===", functions.config().buddy.token);
  let buildWebHookUrl = `https://app.buddy.works/saravanan10393/dev-editor/pipelines/pipeline/210742/trigger-webhook?token=${functions.config().buddy.token}`;
  return fetch(buildWebHookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      branch: "master",
      fromScratch: 1,
      clearCache:1,
      git_url: gitUrl,
      git_branch: gitBranch,
      git_check_id: checkId,
      git_repo: repo
    })
  })
  .then(res => res.json())
  .then((res) => console.log("=== Triggered build in Buddy ===", res))
}

exports.onPullRequestHandler = (request, response) => {
  console.log("======= Request body =====", request.body);
  let webHook = request.body;
  let allowedAction = ['opened', 'reopened'];
  
  if(allowedAction.includes(webHook.action) === false) {
    console.info("=== Ignoring other git events ===", webHook.action);
    return response.end("");
  }

  let branchName = webHook.pull_request.head.ref;
  let gitCloneUrl = webHook.pull_request.head.repo.clone_url;

  return getApiToken()
  .then(apiToken => {
    if(typeof apiToken !== 'string') {
      console.warn("=== Incorrect api token ===", apiToken);
      return Promise.reject(apiToken);
    }
    console.log("=== Github api token ===", apiToken);
    return createGitCheck({
      apiToken: apiToken,
      repo: webHook.pull_request.head.repo.full_name,
      commitSha: webHook.pull_request.head.sha
    });
  })
  .then((check) => triggerBuild({
    gitUrl: gitCloneUrl,
    gitBranch: branchName,
    checkId: check.id,
    repo: webHook.pull_request.head.repo.full_name
  }))
  .then(() => {
    console.log("=== build request cycle finished ===");
    return response.send("Done creating checks");
  })
  .catch(err => {
    console.error("=== Failed to trigger build ===", err);
    return response.status(500).send("Failed to create build");
  });
};
