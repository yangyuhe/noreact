import { MVVM } from './MVVM';

let queue: MVVM<any>[] = [];
let tempQueue = [];
let maxLoop = 10;
let counter = 0;

let promise: Promise<void>;
export function InsertQueue(mvvm: MVVM<any>) {
    if (queue.indexOf(mvvm) != -1) {
        return;
    }
    queue.push(mvvm);

    if (!promise && queue.length > 0) {
        promise = new Promise((resolve, reject) => {
            resolve();
        }).then(() => {
            tempQueue = queue;
            queue = [];
            counter = 0;
            Refresh();
            promise = null;
        });
    }
}
function Refresh() {
    while (true) {
        if (counter > maxLoop) {
            throw new Error("refresh loop more than " + maxLoop);
        }
        counter++;
        tempQueue.forEach(root => {
            root.$ApplyRefresh();
        });
        if (queue.length == 0)
            break;
        tempQueue = queue;
        queue = [];
    }
}
