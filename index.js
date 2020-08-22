const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch');

// try {
//   // `who-to-greet` input defined in action metadata file
//   const nameToGreet = core.getInput('who-to-greet');
//   console.log(`Hello ${nameToGreet}!`);
//   const time = (new Date()).toTimeString();
//   core.setOutput("time", time);
//   // Get the JSON webhook payload for the event that triggered the workflow
//   const payload = JSON.stringify(github.context.payload, undefined, 2)
//   console.log(`The event payload: ${payload}`);
// } catch (error) {
//   core.setFailed(error.message);
// }

try {
    const bridge = core.getInput('bridge-ip');
    const user = core.getInput('user');
    const light = core.getInput('light');
    const status = core.getInput('status');

    const url = `https://${bridge}/api/${user}/${light}`;

    const data = { 'on': status };

    fetch(url, {
        method: 'put',
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(data)
      })
      .then(
        function(response) {
          if (response.status !== 200) {
            let status = 'Looks like there was a problem. Status Code: ' +
              response.status;
              core.setOutput("response", status);
            return;
          }
    
          response.json().then(function(data) {
            let status = data;
            core.setOutput("response", status);
          });
        }
      )
      .catch(function(err) {
        console.log('Fetch Error :-S', JSON.stringify(err, ["message", "arguments", "type", "name"]));
      });



  } catch (error) {
    core.setFailed(error.message);
  }