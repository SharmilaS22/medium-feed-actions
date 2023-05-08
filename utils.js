const fs = require("fs");
const { exec } = require("child_process");

const writeToJson = (filePath, data) => {
  let newContent = JSON.stringify(data);
  let oldContent = fs.readFileSync(filePath, "utf-8");
  let isChanged = oldContent.localeCompare(newContent);

  // if (isChanged != 0) {
    fs.writeFile(filePath, newContent, (err) => {
      if (err) console.log(err);
      else console.log("Data updated in JSON file\n");
    });
  // }

  return true;
};

const execCLI = (command) => new Promise((resolve, reject) => {
  const script = exec(command);
  let output;
  script.stdout.on("data", (data) => output = data)
  script.on("close", (code) => {
      console.log(`${command} exited with code ${code}`);
      if (code !== 0) reject({output})
      resolve({output})
  });
})

// example: writeToJson("src/books.json", { hello: "world" });
// example: const {output} = await execCLI("ls")
module.exports = { writeToJson, execCLI };
