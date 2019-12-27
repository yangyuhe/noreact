import { MVVM } from './MVVM';

let queue: MVVM<any>[] = [];

let promise: Promise<void>;
export function InsertQueue(mvvm: MVVM<any>) {
    if (queue.indexOf(mvvm) != -1) {
        return;
    }
    queue = queue.filter(q => {
        return !q.$HasParent(mvvm);
    });
    let parentAlreadyIn = queue.some(q => {
        return mvvm.$HasParent(q);
    });
    if (!parentAlreadyIn) {
        queue.push(mvvm);
    }

    if (!promise && queue.length > 0) {
        promise = new Promise((resolve, reject) => {
            resolve();
        }).then(() => {
            Refresh();
            queue = [];
            promise = null;
        });
    }
}
function Refresh() {
    queue.forEach(root => {
        root.$ApplyRefresh();
    });
}
