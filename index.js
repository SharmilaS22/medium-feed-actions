const core = require("@actions/core");
// const github = require("@actions/github");
const axios = require("axios");

const { writeToJson, execCLI } = require("./utils");

const username = core.getInput("username");
const MEDIUM_BASE_API =
  "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@";

const jsonFilepath = core.getInput("jsonFilepath");
const githubToken = core.getInput("githubToken");
const commitMessage = "[Actions Bot] Updated the medium feed data json";

core.setSecret(githubToken);

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
  }).catch(({ error }) => {
    console.log("Error occurred in writing to json file\n");
    console.log(error);
  });

  await execCLI(
    `git remote set-url origin https://${githubToken}@github.com/${process.env.GITHUB_REPOSITORY}.git`
  );
  await execCLI(`git config --global user.name actions-bot-feed-update`);
  await execCLI(
    `git config --global user.email actions-bot-feed-update@example.com`
  );
  await execCLI(`git diff | grep ${jsonFilepath}`).then(async ({ output }) => {
    if (output !== "") {
      await execCLI('git diff index.js').then(({output}) => console.log(output))
      await execCLI(`git add ${jsonFilepath}`);
      await execCLI(`git status`);
      await execCLI(`git commit -m "${commitMessage}"`);
      await execCLI(`git push`);
    }
  }).catch(({err}) => console.log("No changes in json file"));
};

main();
