function log(...message: any[]): void;
function joinAppDir(...paths: string[]): string;

type Globals = {
    log: typeof log;
    joinAppDir: typeof joinAppDir;
    // env: KEY;
}