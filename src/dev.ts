import { VNode } from './VNode';
import { MVVM } from "./MVVM";

interface Instance {
    name: string,
    data: { [key: string]: any };
    props: { [key: string]: any };
    children: Instance[];
}
type Listener = ((type: 'new' | 'update' | 'delete', mvvmjson: Instance[], extra?: { isparent: boolean, id: number }) => void);
class Dev {
    roots: MVVM[] = [];
    listeners: Listener[] = [];
    Subscribe(listener: Listener, init: (mvvms: Instance[]) => void) {
        if (this.listeners.indexOf(listener) == -1) {
            if (this.roots) {
                init(this.toJson());
            }
            this.listeners.push(listener);
        }
    }
    AddMvvm(mvvm: MVVM) {
        this.roots.push(mvvm);
        this.listeners.forEach(item => {
            item("new", this.getMvvm(mvvm.$GetAttachedVNode()));
        });
    }
    Unsubscribe(listener: Listener) {
        this.listeners = this.listeners.filter(item => item != listener);
    }
    toJson() {
        let mvvms = [];
        if (this.roots) {
            this.roots.forEach(root => {
                mvvms = mvvms.concat(this.getMvvm(root.$GetAttachedVNode()));
            });
        }
        return mvvms;
    }
    getMvvm(vnode: VNode): Instance[] {
        if (vnode.GetType() == 'text')
            return [];
        if (vnode.GetType() == "standard" || vnode.GetType() == 'fragment') {
            let children = [];
            vnode.GetChildren().forEach(child => {
                children = children.concat(this.getMvvm(child));
            });
            return children;
        }
        if (vnode.GetType() == "custom") {
            let mvvm = vnode.GetMvvm();
            let name = mvvm.constructor.name;
            let data = {};
            Object.keys(mvvm).forEach(key => {
                if (!key.startsWith("$") && mvvm[key] !== mvvm.$GetProps() || key == "$id") {
                    data[key] = mvvm[key];
                }
            });
            let vnodeObj = { name: name, data: data, props: vnode.GetMvvm().$GetProps(), children: this.getMvvm(vnode.GetMvvm().$GetRoot()) };
            return [vnodeObj];
        }
        throw new Error("vnode type error");
    }
    OnChange(type: 'new' | 'update' | 'delete', mvvms: MVVM[], extra?: { isparent: boolean, id: number }) {
        let instances: Instance[] = [];
        mvvms.forEach(mvvm => {
            let instance: Instance = { name: mvvm.constructor.name, props: mvvm.$GetProps(), data: {}, children: [] };
            Object.keys(mvvm).forEach(key => {
                if (!key.startsWith("$") && mvvm[key] !== mvvm.$GetProps() || key == "$id") {
                    instance.data[key] = mvvm[key];
                }
            });
            if (type == "new") {
                instance.children = this.getMvvm(mvvm.$GetRoot());
            }
            instances.push(instance);
        });
        this.listeners.forEach(listener => {
            listener(type, instances, extra);
        });
    }
}
let dev = new Dev();
(window as any).__noreact_dev = dev;
export default dev;
