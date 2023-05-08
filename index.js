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
        // data -> status, feed, items
        data.items.forEach(post => {
            console.log(post.title)
        });
// items ->   'title',       'pubDate',
//   'link',        'guid',
//   'author',      'thumbnail',(blog-banner)
//   'description', 'content',
//   'enclosure',   'categories' (tags)
    })
    .catch(err => console.log(err));
}

main();
