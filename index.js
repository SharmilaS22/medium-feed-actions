const core = require("@actions/core");
// const github = require("@actions/github");
const axios = require("axios");

const { writeToJson, execCLI } = require("./utils");

const username = core.getInput("username");
const MEDIUM_BASE_API =
  "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@";

const jsonFilepath = core.getInput("jsonFilepath");
const githubToken = core.getInput("githubToken");
const commitMessage = "Updated the medium feed data json";

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
  ).catch(({ error }) => {
    console.log("Error in git remote set url\n", error);
  });
  await execCLI(`git config --global user.name actions-bot-feed-update`).catch(
    ({ error }) => {
      console.log("Error in user name config\n", error);
    }
  );
  await execCLI(
    `git config --global user.email actions-bot-feed-update@example.com`
  ).catch(({ error }) => {
    console.log("Error in user email config\n", error);
  });
  await execCLI(`git add ${jsonFilepath}`).catch(({ error }) => {
    console.log("Error in git add\n", error);
  });
  await execCLI(`git status`).catch(({ error }) => {
    console.log("Error in git status\n", error);
  });
  await execCLI(`git commit -m "${commitMessage}"`).catch(({ error }) => {
    console.log("Error in git commit", error);
  });
  await execCLI(`git push`).catch(({ error }) => {
    console.log("Error in git push", error);
  });

  //   `git remote set-url origin https://${githubToken}@github.com/${process.env.GITHUB_REPOSITORY}.git`
  // git config --global user.name <username>
  // git add mediumfilepath
  // git commit -m ""
  // git push
};

main();
