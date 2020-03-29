let events: { [name: string]: Function[] } = {};

export function RegisterEvent(event: string, func: Function) {
    if (!events[event]) {
        events[event] = [];
    }
    events[event].push(func);
}
export function UnregisterEvent(event: string, func?: Function) {
    if (!func) {
        events[event] = [];
    } else {
        if (events[event]) {
            events[event] = events[event].filter(item => item !== func);
        }
    }
}
export function TriggerEvent(event: string, ...args: any[]) {
    if (events[event]) {
        events[event].forEach(func => {
            func(...args);
        });
    }
}
