import { VNode } from './VNode';
import { MVVM } from './MVVM';

const isInBrowser = new Function(
    'try {return this===window;}catch(e){ return false;}'
);
class NoReact {
    private mode: 'deep' | 'shallow' = 'deep';
    public target: MVVM;
    createElement(
        Elem: string | (typeof MVVM) | typeof Fragment,
        attrs: { [key: string]: any },
        ...children: (VNode | VNode[] | string)[]
    ): VNode {
        let allchildren: VNode[] = [];
        this.flatten('$', children, allchildren);

        if (typeof Elem == 'string') {
            let vnode: VNode = new VNode('standard');
            vnode.SetTag(Elem);
            vnode.isMulti = false;

            if (attrs != null) {
                Object.keys(attrs).forEach(key => {
                    vnode.SetAttr(key, attrs[key]);
                })
            }
            vnode.SetChildren(allchildren);
            return vnode;
        }
        if (Elem == Fragment) {
            let vnode: VNode = new VNode('fragment');
            vnode.isMulti = true;
            vnode.SetChildren(allchildren);
            if (attrs != null) {
                Object.keys(attrs).forEach(key => {
                    vnode.SetAttr(key, attrs[key]);
                })
            }
            return vnode;
        }
        if ((Elem as Function).prototype instanceof MVVM) {
            let vnode = new VNode('custom');
            let mvvm = new (Elem as any)(attrs) as MVVM;

            vnode.SetMvvm(mvvm);
            mvvm.$SetChildren(allchildren);
            mvvm.$AttachVNode(vnode);
            if (this.mode == 'deep') {
                let root = mvvm.$DoRender();
                vnode.isMulti = root.isMulti;
            }

            if (attrs != null) {
                Object.keys(attrs).forEach(key => {
                    vnode.SetAttr(key, attrs[key]);
                })
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
export class Ref<T> {
    current: T;
}
export const React = new NoReact();

let counter = 0;
export function GetId() {
    return counter++;
}
