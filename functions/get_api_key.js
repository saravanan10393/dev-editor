const fs = require('fs');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

const getJwtToken = () => {
  let privateKey = fs.readFileSync(`${__dirname}/web_perf_test.pem`);
  let payload = {
    iss: 41156
  };
  
  let jwtToken = jwt.sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn: "10m"
  });
  console.log("jwt token ", jwtToken);
  let publicKey = fs.readFileSync(`${__dirname}/web_perf_test_public.pem`);
  var decoded = jwt.verify(jwtToken, publicKey, { algorithms: ['RS256'] });
  console.log("decoded value ", decoded);
  return jwtToken;
}

const getAppData = (jwt) => {
  return fetch('https://api.github.com/app', {
    headers: {
      Accept: "application/vnd.github.machine-man-preview+json",
      Authorization: `Bearer ${jwt}`
    }
  })
  .then(res => res.json())
}


const getInstallations = (jwt) => {
  let url = 'https://api.github.com/app/installations';
  return fetch(url, {
    headers: {
      Accept: "application/vnd.github.machine-man-preview+json",
      Authorization: `Bearer ${jwt}`
    }
  })
  .then(res => res.json())
}

function getInstallationToken(installationId, jwt) {
  let url = `https://api.github.com/app/installations/${installationId}/access_tokens`;
  return fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/vnd.github.machine-man-preview+json",
      Authorization: `Bearer ${jwt}`
    },
    body: JSON.stringify({})
  })
  .then(res => res.json())
}

exports.getApiToken = function getApiToken() {
  let jwt = getJwtToken();
  return getAppData(jwt)
    .then(appData => {
      console.log("=== github app data ====", appData);
      return appData
    })
    .then(() => getInstallations(jwt))
    .then(installData => {
      console.log("=== github app installation data ====", installData);
      return installData[0].id;
    })
    .then(installationId => {
      return getInstallationToken(installationId, jwt);
    })
    .then(installationAccessToken => {
      return installationAccessToken.token;
    })
    .catch(err => {
      console.error("=== Failed to get installationToken ===", err);
      return Promise.reject(err);
    });
}
