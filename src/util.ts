import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";


export const msTime: MsTime = {
    s: 1_000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000,
    w: 604_800_000,
};

export const time = {
    /** Seconds(n) -> to ms */
    sec: (n: num) => msTime.s * n,
    /** Minutes(n) -> to ms */
    min: (n: num) => msTime.m * n,
    /** Hours(n)   -> to ms */
    hrs: (n: num) => msTime.h * n,
    /** Days(n)    -> to ms */
    dys: (n: num) => msTime.d * n,
    /** Weeks(n)   -> to ms */
    wks: (n: num) => msTime.w * n,

    /** Count time elapsed since: `from` until `to`, @default to: Date.now() */
    since: (from: num, to: num = Date.now()) => to - from,
    /** Count down to: `target` time from `from`, `from` @default from: Date.now() */
    until: (target: num, from: num = Date.now()) => target - from,

    future: {
        /** fnc(n)  -> add ms to now */
        ms: (n: num) => Date.now() + n,
        /** fnc(n)  -> add sec to now */
        sec: (n: num) => Date.now() + n * msTime.s,
        /** fnc(n)  -> add min to now */
        min: (n: num) => Date.now() + n * msTime.m,
    },

    msTo: {
        /** fnc(n)  -> from ms to num of seconds */
        sec: (ms: num) => ms / msTime.s,
        /** fnc(n)  -> from ms to num of minutes */
        min: (ms: num) => ms / msTime.m,
        /** fnc(n)  -> from ms to num of hours */
        hrs: (ms: num) => ms / msTime.h,
        /** fnc(n)  -> from ms to num of days */
        dys: (ms: num) => ms / msTime.d,
        /** fnc(n)  -> from ms to num of weeks */
        wks: (ms: num) => ms / msTime.w,
    },

    get now() { return Date.now(); }
} as const;

function readJSON<T>(filePath: string, defaultData: T): T;
function readJSON<T>(filePath: string, defaultData?: T): T | undefined;
function readJSON<T>(filePath: string, defaultData?: T) {
    try {
        return existsSync(filePath) ? JSON.parse(readFileSync(filePath, 'utf8')) : defaultData;
    } catch(err) {
        log(err)
        return defaultData;
    }
}

function writeJSON<T>(filePath: string, data: T) {
    const dir = dirname(filePath)
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(filePath, JSON.stringify(data));

    return data;
}

const dataSync_DATA: {
    pathRef: { [K in string]: boolean; };
    age: DataSync<Record<string, number | undefined>>;
} = {
    pathRef: {}
} as any;

/**
 * JSON data sync helper.
 * Make it easy to store persistent json data.
 */
export class DataSync<T extends { [K in string]: any }> {
    private dataDir: string;
    private filePath: string;

    constructor(
        private defaultData: T,
        fileName: string,
        opts: {
            dataDir?: string,
            /** Max ms time can exist before the data is reset to default */
            maxAge?: number,
        } = {}
    ) {
        this.dataDir = opts.dataDir || joinAppDir('tmp/data');
        this.filePath = join(this.dataDir, fileName);

        if (dataSync_DATA.pathRef[this.filePath])
            throw `Filepath "${this.filePath}" already in use`;

        dataSync_DATA.pathRef[this.filePath] = true;

        if (opts.maxAge || -1 > -1) {
            const ageOfData = dataSync_DATA.age.getKey(this.filePath) || 0;
            if (time.until(ageOfData + opts.maxAge!) < 0) {
                this.reset();
                dataSync_DATA.age.setKey(this.filePath, time.now)
            }
        }
    }

    get = (): T => readJSON(this.filePath, this.defaultData);

    set = (data: T): T => writeJSON(this.filePath, data);

    /** Resets the data to the default value */
    reset = (): T => this.set(this.defaultData);

    getKey = <K extends keyof T>(key: K): T[K] => this.get()[key];
    setKey<K extends keyof T>(key: K, val: T[K]): T[K] {
        const data = this.get();
        data[key] = val;

        this.set(data);
        return data[key];
    }
}

dataSync_DATA.age =  new DataSync<Record<string, number | undefined>>({}, '__data-sync-age__.json');