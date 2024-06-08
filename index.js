const { spawn } = require("child_process");

// thiz is for restarting purposes
const start = () => {
  const child = spawn("bun app.js", {
    cwd: __dirname,
    shell: true,
    stdio: "inherit",
  });

  child.on("close", (code) => {
    if (code === 2) return start();
  });
};

start();
