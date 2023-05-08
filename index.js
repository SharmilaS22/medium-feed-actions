const core = require("@actions/core");
const axios = require("axios");

const username = core.getInput("username");
const MEDIUM_BASE_API =
  "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@";


const main = () => {
    console.log(MEDIUM_BASE_API + username);
    axios
    .get(MEDIUM_BASE_API + username)
    .then(({ data }) => {
        console.log(JSON.parse(data));
    })
    .catch((err) => console.log(err));
}

main();
