// import { key } from "./_key";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

{
    const appDir = dirname(fileURLToPath(import.meta.url));

    const globals: Globals = {
        joinAppDir: (...paths: string[]) => join(appDir, ...paths),
        log: console.log,
        // env: key
    }

    Object.assign(globalThis, globals);
}