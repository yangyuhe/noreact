import { ApplyAttr, RemoveAttr, SerializeAttr, GetEventAttrName as EventName } from './attribute';
import { MVVM } from './MVVM';
import { Ref } from './react';

export class VNode {
    /**虚拟节点名称，即标准html的标签名 */
    protected tag: string = '';
    private text: string = '';
    /**子节点 */
    protected children: VNode[] = [];
    /**属性集合 */
    private attrs: { [key: string]: any } = {};
    /**父节点 */
    private parent: VNode = null;

    /**关联的组件实例，当type='custom'有效 */
    private mvvm: MVVM;
    /**关联的实际dom元素 */
    private dom: (HTMLElement | Text);
    /**节点类型 */
    private type: 'standard' | 'custom' | 'text' | 'fragment';
    /**是否已经被销毁 */
    private isDestroyed = false;
    /**是否是多dom节点 */
    isMulti: boolean = false;

    constructor(type: 'standard' | 'custom' | 'text' | 'fragment') {
        this.type = type;
    }
    get Doms(): (HTMLElement | Text)[] {
        if (this.type == "standard" || this.type == "text")
            return [this.dom];
        if (this.type == "fragment") {
            let doms = [];
            this.children.forEach(child => {
                doms = doms.concat(child.Doms);
            });
            return doms;
        }
        if (this.type == "custom")
            return this.mvvm.$GetRoot().Doms;
    }
    SetTag(tag: string) {
        this.tag = tag;
    }
    GetTag() {
        return this.tag;
    }
    GetText() {
        return this.text;
    }
    SetText(text: string) {
        this.text = text;
    }
    SetMvvm(component: MVVM) {
        this.mvvm = component;
    }
    GetMvvm() {
        return this.mvvm;
    }
    GetParent() {
        return this.parent;
    }
    InsertVNode(child: VNode, index: number, domchange: boolean) {
        //虚拟dom操作
        this.children.splice(index, 0, child);
        child.parent = this;
        if (domchange) {
            let res = this.GetSiblingDom(child);
            let doms = child.Doms;
            if (res.isparent) {
                (res.dom as HTMLElement).append(...doms);
            } else {
                doms.forEach(dom => {
                    res.dom.parentNode.insertBefore(dom, res.dom);
                });
            }
        }
    }
    //child是当前节点的子节点，获取child的dom，如果没有就找child后的相邻节点的dom，如果都没有就返回父节点
    GetSiblingDom(child: VNode): { dom: HTMLElement | Text, isparent: boolean } {
        if (this.type == 'custom') {
            if (this.parent)
                return this.parent.GetSiblingDom(this);
            return { dom: this.mvvm.$GetMountDom(), isparent: true };
        }
        let index = this.children.indexOf(child);
        index++;
        while (index < this.children.length) {
            let c = this.children[index];
            let doms = c.Doms;
            if (doms.length > 0)
                return { dom: doms[0], isparent: false };
            index++;
        }
        if (this.isMulti)
            return this.parent.GetSiblingDom(this);
        return { dom: this.dom, isparent: true };
    }
    /**移除一个孩子节点，注意会引发dom操作 */
    RemoveVNode(child: VNode, index: number, domchange: boolean = true) {
        this.children.splice(index, 1);
        if (domchange) {
            let doms = child.Doms;
            if (doms)
                doms.forEach(dom => {
                    dom.parentNode.removeChild(dom);
                });
        }
    }
    SetChildren(children: VNode[]) {
        children.forEach(child => {
            child.parent = this;
        });
        this.children = children;
    }
    IsDestroyed() {
        return this.isDestroyed;
    }
    Destroy() {
        this.isDestroyed = true;
        if (this.type == 'custom') {
            this.mvvm.$Destroy();
        }
        this.children.forEach(child => {
            child.Destroy();
        });
    }
    GetChildren() {
        return this.children;
    }
    /**渲染完毕后的回调 */
    Rendered() {
        if (this.type == 'custom') this.mvvm.$Rendered();
        if (this.type == 'standard' || this.type == 'fragment') {
            this.children.forEach(child => {
                child.Rendered();
            });
        }
        if (this.attrs['ref'] instanceof Ref) {
            if (this.type == "standard")
                this.attrs['ref'].current = (this.dom as HTMLElement);
            else {
                if (this.type == "custom") {
                    this.attrs['ref'].current = this.mvvm;
                }
            }
        }
    }

    GetType() {
        return this.type;
    }

    SetAttr(name: string, value: any) {
        this.attrs[name] = value;
    }
    GetAttr(name: string) {
        return this.attrs[name];
    }
    GetAttrs() {
        return this.attrs;
    }
    SetParent(vnode: VNode) {
        this.parent = vnode;
    }
    ApplyAttrDiff(newAttrs: { [key: string]: any }) {
        Object.keys(this.attrs).forEach(key => {
            let eventName = EventName(key);
            let isEvent = eventName != null;
            if (newAttrs[key] == null) {
                //删除的属性
                if (isEvent) {
                    (this.dom as HTMLElement).removeEventListener(
                        eventName,
                        this.attrs[key]
                    );
                } else {
                    RemoveAttr(this.dom as HTMLElement, key, this.attrs[key]);
                }
            } else {
                //已存在的属性
                if (
                    key == 'style' &&
                    toString.call(this.attrs.style) == '[object Object]' &&
                    toString.call(newAttrs.style) == '[object Object]'
                ) {
                    let oldStyle = this.attrs.style;
                    let newStyle = newAttrs.style;

                    Object.keys(oldStyle).forEach(k => {
                        if (!newStyle[k]) {
                            (this.dom as HTMLElement).style[k] = '';
                        } else {
                            if (newStyle[k] != oldStyle[k]) {
                                (this.dom as HTMLElement).style[k] =
                                    newStyle[k];
                            }
                        }
                    })
                    Object.keys(newStyle).forEach(k => {
                        if (!oldStyle[k]) {
                            (this.dom as HTMLElement).style[k] =
                                newStyle[k];
                        }
                    });
                    return;
                }
                if (isEvent) {
                    if (this.attrs[key] != newAttrs[key]) {
                        this.dom.removeEventListener(
                            eventName,
                            this.attrs[key]
                        );
                        this.dom.addEventListener(
                            eventName,
                            newAttrs[key]
                        );
                    }
                } else {
                    if (this.attrs[key] != newAttrs[key]) {
                        RemoveAttr(<HTMLElement>this.dom, key, this.attrs[key]);
                        ApplyAttr(
                            <HTMLElement>this.dom,
                            key,
                            newAttrs[key]
                        );
                    }
                }
            }
        });
        Object.keys(newAttrs).forEach(key => {
            let eventName = EventName(key);
            let isEvent = eventName != null;
            if (this.attrs[key] == null) {
                //新增属性
                if (isEvent) {
                    (this.dom as HTMLElement).addEventListener(
                        eventName,
                        newAttrs[key]
                    );
                } else {
                    ApplyAttr(
                        <HTMLElement>this.dom,
                        key,
                        newAttrs[key]
                    );
                }
            }
        });
        this.attrs = newAttrs;
    }
    ToHtml(): string {
        if (this.type == 'text') return this.text;
        if (this.type == 'custom') {
            let html = this.mvvm.$ToHtml();
            return html;
        }
        if (this.type == 'standard') {
            let innerhtmls: string[] = [];

            innerhtmls.push(`<${this.tag}`);
            Object.keys(this.attrs).forEach(key => {
                let attrStr = SerializeAttr(key, this.attrs[key]);
                if (attrStr) innerhtmls.push(' ' + attrStr);
            });
            innerhtmls.push('>');

            this.children.forEach(child => {
                let res = child.ToHtml();
                innerhtmls.push(res);
            });
            innerhtmls.push(`</${this.tag}>`);
            return innerhtmls.join('');
        }
        if (this.type == 'fragment') {
            let innerhtmls: string[] = [];

            this.children.forEach(child => {
                let res = child.ToHtml();
                innerhtmls.push(res);
            });
            return innerhtmls.join('');
        }
    }
    ToDom(): (HTMLElement | Text)[] {
        if (this.type == 'custom') {
            let doms = this.mvvm.$ToDom();
            return doms;
        }
        if (this.type == 'standard') {
            let elem = document.createElement(this.tag);
            this.dom = elem;
            this.children.forEach(child => {
                let doms = child.ToDom();
                doms.forEach(dom => elem.appendChild(dom));
            });
            Object.keys(this.attrs).forEach(key => {
                let eventName = EventName(key);
                if (eventName) {
                    elem.addEventListener(eventName, this.attrs[key]);
                } else ApplyAttr(elem, key, this.attrs[key]);
            });
            return [elem];
        }
        if (this.type == 'fragment') {
            let children: (HTMLElement | Text)[] = [];
            this.children.forEach(child => {
                let doms = child.ToDom();
                children = children.concat(doms);
            });
            return children;
        }
        if (this.type == 'text') {
            let text = document.createTextNode(this.text);
            this.dom = text;
            return [text];
        }
    }
    EmitUp(event: string, ...data: any[]) {
        if (this.parent) {
            if (this.parent.type == 'custom')
                this.parent.mvvm.$Trigger(event, ...data);
            this.parent.EmitUp(event, ...data);
        }
    }
    EmitDown(event: string, ...data: any[]) {
        this.children.forEach(child => {
            if (child.type == 'custom') {
                child.mvvm.$Trigger(event, ...data);
            }
            child.EmitDown(event, ...data);
        });
    }

    AttachDom(dom: HTMLElement | Text) {
        this.dom = dom;
        Object.keys(this.attrs).forEach(key => {
            let eventName = EventName(key);
            if (eventName) {
                dom.addEventListener(eventName, this.attrs[key]);
            }
        });
    }
    GetNearestAncestorMvvm(): MVVM {
        if (this.type == "custom")
            return this.mvvm;
        return this.parent && this.parent.GetNearestAncestorMvvm();
    }
    GetFirstChildMvvm(): MVVM {
        if (this.type == "custom")
            return this.mvvm;
        for (let child of this.children) {
            let mvvm = child.GetFirstChildMvvm();
            if (mvvm)
                return mvvm;
        }
        return null;
    }
    GetAllMvvm(): MVVM[] {
        if (this.type == "custom")
            return [this.mvvm];
        if (this.type == 'text')
            return [];
        if (this.type == "standard" || this.type == "fragment") {
            let total = [];
            this.children.forEach(child => {
                total = total.concat(child.GetAllMvvm());
            });
            return total;
        }
        return [];
    }
}
