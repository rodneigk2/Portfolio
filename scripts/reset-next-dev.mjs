import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { setTimeout as wait } from "node:timers/promises";

const root = process.cwd();
const nextDir = path.join(root, ".next");
const port = process.env.PORT || "3000";

function run(command, args) {
  try {
    execFileSync(command, args, { stdio: "ignore" });
  } catch {
    // Best effort cleanup. If nothing is listening, there is nothing to stop.
  }
}

function stopPort(localPort) {
  if (process.platform === "win32") {
    run("powershell.exe", [
      "-NoProfile",
      "-Command",
      `$connections = Get-NetTCPConnection -LocalPort ${localPort} -State Listen -ErrorAction SilentlyContinue; if ($connections) { $connections | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue } }`,
    ]);
    return;
  }

  run("sh", ["-c", `pids=$(lsof -ti tcp:${localPort} 2>/dev/null); if [ -n "$pids" ]; then kill -9 $pids; fi`]);
}

stopPort(port);

async function removeNextDir() {
  for (let attempt = 1; attempt <= 8; attempt += 1) {
    try {
      fs.rmSync(nextDir, {
        recursive: true,
        force: true,
        maxRetries: 3,
        retryDelay: 150,
      });
      return;
    } catch (error) {
      if (attempt === 8) {
        throw error;
      }

      await wait(250);
    }
  }
}

await wait(350);
await removeNextDir();

console.log(`Reset Next dev state: stopped port ${port} and removed .next.`);
