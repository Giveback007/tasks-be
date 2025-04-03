import { WebSocketServer, type WebSocket } from 'ws';
import { randomBytes } from 'crypto';
const log = console.log;

const dict: DataDict = { };
setTimeout(() => {
    const wss = new WebSocketServer({ port: 8080 });
    const listeners: Dict<WebSocket> = {};

    function syncDict(upd: DataDict) {
        let updates: (AllData)[] = [];
        for (let id in upd) {
            const o1 = dict[id] || { time: 0 } as AllData;
            const o2 = upd[id] || { time: 0 } as AllData;

            if (o2.time !== o1.time) {
                let o = o2.time > o1.time ? o2 : o1;
                if (o.id) updates.push(o)
            }
        }


        if (updates.length) {
            console.log(`--- SEND ${updates.length}: ${new Date().toLocaleTimeString()} ---`)
            updates.map(x => dict[x.id] = x);

            const jsonStr = JSON.stringify(dict);
            Object.values(listeners).map(ws => ws.send(jsonStr))
        }
    }

    wss.on('connection', (ws) => {
        const wsId = randomBytes(16).toString("hex");
        listeners[wsId] = ws;

        log(`CONNECTION: ${wsId}`)

        ws.on('error', console.error);
        ws.on('message', (data) => syncDict(JSON.parse(data.toString())));
        ws.on('close', () => {
            ws.close();
            delete listeners[wsId];
        })

        ws.send(JSON.stringify(dict));
    });

    log('WS started on :8080')
});

setInterval(() => Object.values(dict).forEach(({ id, time, del }) => {
    // Permanently Delete items that were deleted more than a week ago
    if (del && Date.now() - time > 1000 * 60 * 60 * 24 * 7) delete dict[id];
}), 1000 * 60 * 60 /* Every Hour */);