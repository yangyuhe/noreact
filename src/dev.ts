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
    roots: MVVM<any>[] = [];
    listeners: Listener[] = [];
    Subscribe(listener: Listener, init: (mvvms: Instance[]) => void) {
        if (this.listeners.indexOf(listener) == -1) {
            if (this.roots) {
                init(this.toJson());
            }
            this.listeners.push(listener);
        }
    }
    AddMvvm(mvvm: MVVM<any>) {
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
        if (vnode.GetType() == "standard" || vnode.GetType() == 'text') {
            let children = [];
            vnode.GetChildren().forEach(child => {
                children = children.concat(this.getMvvm(child));
            });
            return children;
        }
        if (vnode.GetType() == "fragment") {
            let vnodeObj = { name: "fragment", data: null, props: null, children: [] };
            vnode.GetChildren().forEach(child => {
                let res = this.getMvvm(child);
                if (res)
                    vnodeObj.children = vnodeObj.children.concat(res);
            });
            return [vnodeObj];
        }
        if (vnode.GetType() == "custom") {
            let name = vnode.GetInstance().constructor.name;
            let data = {};
            Object.keys(vnode.GetInstance()).forEach(key => {
                if (!key.startsWith("$") || key == "$id") {
                    data[key] = vnode.GetInstance()[key];
                }
            });
            let vnodeObj = { name: name, data: data, props: vnode.GetInstance().GetProps(), children: this.getMvvm(vnode.GetInstance().$GetRoot()) };
            return [vnodeObj];
        }
        throw new Error("vnode type error");
    }
    OnChange(type: 'new' | 'update' | 'delete', mvvms: MVVM<any>[], extra?: { isparent: boolean, id: number }) {
        let instances: Instance[] = [];
        mvvms.forEach(mvvm => {
            let instance: Instance = { name: mvvm.constructor.name, props: mvvm.GetProps(), data: {}, children: [] };
            Object.keys(mvvm).forEach(key => {
                if (!key.startsWith("$") || key == "$id") {
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
