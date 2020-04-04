import { MVVM } from "./MVVM"
let events: { [name: string]: { cb: Function, mvvm: MVVM }[] } = {};

export function RegisterEvent(event: string, func: Function, mvvm: MVVM) {
    if (!events[event]) {
        events[event] = [];
    }
    events[event].push({ cb: func, mvvm: mvvm });
}

export function TriggerEvent(event: string, ...args: any[]) {
    if (events[event]) {
        events[event] = events[event].filter(item => !item.mvvm.$IsDestroyed());
        events[event].forEach(item => {
            item.cb(...args);
        });
    }
}
