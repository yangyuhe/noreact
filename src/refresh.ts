import { MVVM } from './MVVM';

let queue: MVVM<any>[] = [];
let tempQueue: MVVM<any>[] = [];
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
        tempQueue.sort((m1: MVVM<any>, m2: MVVM<any>) => {
            if (m1.$IsParentOf(m2)) {
                return -1;
            }
            if (m2.$IsParentOf(m1)) {
                return 1;
            }
            return 0;
        });
        if (counter > maxLoop) {
            throw new Error("refresh loop more than " + maxLoop);
        }
        counter++;
        tempQueue.forEach(root => {
            if (!root.$IsDestroyed() && root.$GetDirty())
                root.$ApplyRefresh();
        });
        if (queue.length == 0)
            break;
        tempQueue = queue;
        queue = [];
    }
}
