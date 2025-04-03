import { WebSocketServer, type WebSocket } from 'ws';
import { randomBytes } from 'crypto';
const wss = new WebSocketServer({ port: 8080 });

const dict: DataDict = {};
const listeners: Dict<WebSocket> = {};

function syncDict(upd: DataDict) {
    console.log(`--- SYNC: ${new Date().toLocaleTimeString()} ---`)
    let updates: (Task | List | Group | Timer)[] = [];
    for (let id in upd) {
        const o1 = dict[id] || { time: 0 } as Task | List | Group | Timer;
        const o2 = upd[id] || { time: 0 } as Task | List | Group | Timer;

        if (o2.time !== o1.time) {
            let o = o2.time > o1.time ? o2 : o1;
            if (o.id) updates.push(o)
        }
    }


    if (updates.length) {
        console.log(`--- SEND: ${new Date().toLocaleTimeString()} ---`)
        const updObj: DataDict = {};
        updates.map(x => updObj[x.id] = dict[x.id] = x);

        const jsonStr = JSON.stringify(updObj);
        Object.values(listeners).map(ws => ws.send(jsonStr))
    }
}

wss.on('connection', (ws) => {
    const wsId = randomBytes(16).toString("hex");
    listeners[wsId] = ws;

    ws.on('error', console.error);

    ws.on('message', (data) => syncDict(JSON.parse(data.toString())));

    ws.on('close', () => {
        ws.close();
        delete listeners[wsId];
    })

    ws.send(JSON.stringify(dict));
});