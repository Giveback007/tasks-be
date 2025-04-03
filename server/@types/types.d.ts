// https://www.typescriptlang.org/docs/handbook/utility-types.html
// Above link for built in utility types

// https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html
// String template literal types

type num = number;
type str = string;
type bol = boolean;

type obj<
    key extends keyof any = any,
    val = any,
> = {
    [K in key]: val
}

type undf = undefined;

type rec<K extends keyof any = any, T = any> = Record<K, T>;
type Dict<T> = { [id: string]: T };

type AnyFnc = (...args: any[]) => any;

type EmptyObj = Record<string | number | symbol, never>

/** string type keyof T */
type StrKeys<T> = Extract<keyof T, string>;

type AwaitReturn<T extends AnyFnc> = Awaited<ReturnType<T>>;

type UnionToTuple<U extends string, R extends any[] = []> = {
    [S in U]: // for each variant in the union
      Exclude<U, S> extends never // remove it and..
        ? [...R, S] // ..stop recursion if it was the last variant
        : UnionToTuple<Exclude<U, S>, [...R, S]> // ..recur if not
}[U] // extract all values from the object

type KeysMatching<T, V> = {[K in keyof T]-?: T[K] extends V ? K : never}[keyof T];

/**
 * ```ts
 * const o = {
 *  k1: true,
 *  k2: 'string',
 *  k3: false
 * }
 *
 * type Y = KeysOfValueType<typeof o, boolean>
 * type Y => "k1" | "k3"
 * ```
 */
type KeysOfValueType<O, T> = {
    [I in keyof O]: O[I] extends T ? I : never
}[keyof O];

type TupleIdx<T extends readonly any[]> =
    Extract<keyof T, `${number}`> extends `${infer N extends number}` ? N : never;

type JsType =
    | 'array'
    | 'bigint'
    | 'boolean'
    | 'function'
    | 'NaN'
    | 'null'
    | 'number'
    | 'object'
    | 'string'
    | 'symbol'
    | 'undefined';

type JsTypeFind<S extends JsType> =
    S extends 'array'       ? any[] :
    S extends 'bigint'      ? bigint :
    S extends 'boolean'     ? boolean :
    S extends 'function'    ? AnyFnc :
    S extends 'NaN'         ? number :
    S extends 'null'        ? null :
    S extends 'number'      ? number :
    S extends 'object'      ? object :
    S extends 'string'      ? string :
    S extends 'symbol'      ? symbol :
    S extends 'undefined'   ? undefined : never;

// --/-- TIME TYPES --/-- //

type MsTime = {
    /** second */
    s: 1000;
    /** minute */
    m: 60_000;
    /** hour */
    h: 3_600_000;
    /** day */
    d: 86_400_000;
    /** week */
    w: 604_800_000;
}

type Time = {
    tzOffsetMin: number;
    /** Timestamp: in MS since midnight, January 1, 1970 UTC. */
    epochMs: number;
    ianaTZ: string;
    /** ISO time local to timezone */
    localISO: string;
    timeObj: TimeObj;
    Date: Date;
}

type TimeObj = {
    y:      num;
    m:      num;
    d:      num;
    hr:     num;
    min:    num;
    sec:    num;
    ms:     num;
    wDay:   DayOfWeek;
};

type DayOfWeek = "Su" | "Mo" | "Tu" | "We" | "Th" | "Fr" | "Sa";

type AnyDate = string | number | Date;