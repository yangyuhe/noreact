import { VNode } from './VNode';
import { MVVMConstructor, MVVM } from './MVVM';
import { VNODE_ID } from './attribute';

const isInBrowser = new Function(
    'try {return this===window;}catch(e){ return false;}'
);
class React {
    private counter = 0;
    private mode: 'deep' | 'shallow' = 'deep';
    public target: MVVM<any>;
    Fragment = Fragment;
    ResetCounter() {
        this.counter = 0;
    }
    createElement(
        Elem: string | (typeof MVVM) | typeof Fragment,
        attrs: { [key: string]: any },
        ...children: (VNode | VNode[] | string)[]
    ): VNode {
        let allchildren: VNode[] = [];
        this.flatten('', children, allchildren);

        if (typeof Elem == 'string') {
            let vnode: VNode = new VNode('standard');
            vnode.SetTag(Elem);
            vnode.isMulti = false;
            if (!isInBrowser()) {
                vnode.SetAttr(VNODE_ID, this.counter);
                this.counter++;
            }

            if (attrs != null) {
                for (let key in attrs) {
                    vnode.SetAttr(key, attrs[key]);
                }
            }
            vnode.SetChildren(allchildren);
            return vnode;
        }
        if (Elem == this.Fragment) {
            let vnode: VNode = new VNode('fragment');
            vnode.isMulti = true;
            if (!isInBrowser()) {
                vnode.SetAttr(VNODE_ID, this.counter);
                this.counter++;
            }
            vnode.SetChildren(allchildren);
            if (attrs != null) {
                for (let key in attrs) {
                    vnode.SetAttr(key, attrs[key]);
                }
            }
            return vnode;
        }
        if ((Elem as Function).prototype instanceof MVVM) {
            let vnode = new VNode('custom');
            if (!isInBrowser()) {
                vnode.SetAttr(VNODE_ID, this.counter);
                this.counter++;
            }

            let mvvm = new (Elem as any)(attrs) as MVVM<any>;

            vnode.SetMvvm(mvvm);
            mvvm.$SetChildren(allchildren);
            mvvm.$AttachVNode(vnode);
            if (this.mode == 'deep') {
                let root = mvvm.$DoRender();
                vnode.isMulti = root.isMulti;
            }

            if (attrs != null) {
                for (let key in attrs) {
                    vnode.SetAttr(key, attrs[key]);
                }
            }
            return vnode;
        }
    }

    private flatten(prefix: string, children: any[], res: VNode[]) {
        children.forEach((child, index) => {
            if (child == null) return;
            if (child instanceof Array) {
                this.flatten(prefix + index + '_', child, res);
            } else {
                if (child instanceof VNode) {
                    let key = child.GetAttr('key');
                    if (key != null) {
                        res.push(child);
                    } else {
                        child.SetAttr('key', prefix + index);
                        res.push(child);
                    }
                } else {
                    let textnode = new VNode('text');
                    textnode.SetText(child + '');
                    textnode.SetAttr('key', prefix + index);
                    res.push(textnode);
                }
            }
        });
    }
    ChangeMode(mode: 'shallow' | 'deep') {
        this.mode = mode;
    }
}
export class Fragment {

}
export default new React();
