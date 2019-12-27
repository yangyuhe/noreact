import { MVVM, MVVMConstructor } from './core/MVVM';

export function GetJSModule(name: string) {
    let promise: Promise<MVVMConstructor<any>>;
    if (name == 'todov1') {
        promise = import(
            /*webpackChunkName:"todov1" */ './components/todo/todo-v1'
        ).then(module => {
            return module.ToDoV1;
        });
    }
    if (name == 'todov2') {
        promise = import(
            /*webpackChunkName:"todov2" */ './components/todo/todo-v2'
        ).then(module => {
            return module.ToDoV2;
        });
    }
    if (name == 'housecard') {
        promise = import(
            /*webpackChunkName:"housecard" */ './components/house-card/house-card'
        ).then(module => {
            return module.HouseCard;
        });
    }
    if (!promise) throw new Error('no specified module found:' + module);
    return promise;
}
