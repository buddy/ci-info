import { spawn } from "cross-spawn";

export function gitExec(arguments_: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const process = spawn("git", arguments_, {
      stdio: ["ignore", "pipe", "pipe"],
    });
    let errorOutput = "";
    let output = "";

    process.stdout.on("data", (message) => {
      output += message;
    });

    process.stderr.on("data", (message) => {
      errorOutput += message;
    });

    process.on("close", (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(errorOutput);
      }
    });
  });
}
