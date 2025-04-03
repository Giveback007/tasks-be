type _Base = {
    id: str;
    idx?: num;
    /** Last update time of obj */
    time: num;
    del?: bol;
}

type Timer = _Base & {
    id: 'TIMER';
    t: 'timer';
    start: num;
    focus: num;
    rest: num;
    pauseTime: num;
    state: 'PAUSE' | 'FOCUS' | 'REST';
}

type Task = _Base & {
    t: 'T';
    txt: str;
    done: bol;
    listId: str;
    clr?: num;
};

type List = _Base & {
    t: 'L';
    name: str;
    groupId: str;
};

type Group = _Base & {
    t: 'G';
    name: str;
}

type DataDict = Dict<Task | List | Group | Timer>;