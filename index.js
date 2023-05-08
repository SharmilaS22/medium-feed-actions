const core = require("@actions/core");
// const github = require("@actions/github");
const axios = require("axios");

const { writeToJson, execCLI } = require("./utils");

const username = core.getInput("username");
const MEDIUM_BASE_API =
  "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@";

const jsonFilepath  = core.getInput("jsonFilepath");
const githubToken   = core.getInput("githubToken")
const commitMessage = "Updated the medium feed data json"

const main = async () => {
  let postsArr = [];
  // console.log("URL: ", MEDIUM_BASE_API + username);

  const { data } = await axios.get(MEDIUM_BASE_API + username);

  if (data.status == "error") {
    // if error data -> status, message
    console.log("Couldn't get response ", data.message);
    return;
  }

  // data -> status, feed, items
  data.items.forEach((post) => {
    postsArr.push(post);
    console.log(post.title);
  });
  // items -> 'title', 'pubDate', 'link', 'guid', 'author', 'thumbnail'(blog-banner)
  //          'description', 'content', 'enclosure', 'categories'(tags)

  writeToJson(jsonFilepath, {
    posts: postsArr,
  });

  execCLI(`git remote set-url origin https://${githubToken}@github.com/${process.env.GITHUB_REPOSITORY}.git`)
  execCLI(`git config --global user.name actions-bot-feed-update`)
  execCLI(`git config --global user.email actions-bot-feed-update@example.com`)
  execCLI(`git add ${jsonFilepath}`)
  execCLI(`git commit -m "${commitMessage}"`)
  execCLI(`git push`)

//   `git remote set-url origin https://${githubToken}@github.com/${process.env.GITHUB_REPOSITORY}.git`
// git config --global user.name <username>
// git add mediumfilepath
// git commit -m ""
// git push
};

main();