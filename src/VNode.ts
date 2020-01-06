import { ApplyAttr, RemoveAttr, SerializeAttr, GetEventAttrName as EventName } from './attribute';
import { MVVM } from './MVVM';

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
    private mvvm: MVVM<any>;
    /**关联的实际dom元素 */
    private doms: (HTMLElement | Text)[];
    /**节点类型 */
    private type: 'standard' | 'custom' | 'text';
    /**是否已经被销毁 */
    private isDestroyed = false;

    constructor(type: 'standard' | 'custom' | 'text') {
        this.type = type;
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
    SetMvvm(component: MVVM<any>) {
        this.mvvm = component;
    }
    GetInstance() {
        return this.mvvm;
    }
    GetParent() {
        return this.parent;
    }
    /**在索引为index位置增加一个child,index=-1表示在末尾添加，注意会引发实际的dom操作 */
    InsertVNode(child: VNode, index: number) {
        //dom操作
        let doms = child.GetDom();
        if (doms && doms.length > 0) {
            let sibling: HTMLElement | Text = null;
            while (this.children[index]) {
                let subdoms = this.children[index].GetDom();
                if (subdoms.length > 0) {
                    sibling = subdoms[0];
                    break;
                } else {
                    index++;
                }
            }
            if (sibling) {
                doms.forEach(dom => {
                    sibling.parentNode.insertBefore(dom, sibling);
                });
            } else {
                let top = this.doms.length > 1 ? this.doms[0].parentNode : this.doms[0];
                doms.forEach(dom => {
                    top.appendChild(dom);
                });
            }
        }

        //虚拟dom操作
        this.children.splice(index, 0, child);
        child.parent = this;
    }
    /**末尾添加一个孩子节点，不包含dom操作 */
    AppendChild(child: VNode) {
        child.parent = this;
        this.children.push(child);
    }
    /**移除一个孩子节点，注意会引发dom操作 */
    RemoveVNode(child: VNode, index: number, domchange: boolean = true) {
        this.children.splice(index, 1);
        if (domchange) {
            let doms = child.GetDom();
            if (doms)
                doms.forEach(dom => {
                    dom.parentNode.removeChild(dom);
                });
        }
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
        if (this.type == 'standard') {
            this.children.forEach(child => {
                child.Rendered();
            });
        }
    }
    GetDom() {
        return this.doms;
    }
    GetRef(name: string): VNode {
        let attr = this.attrs['ref'];
        if (attr)
            return this;
        else {
            if (this.type != 'custom') {
                for (let i = 0; i < this.children.length; i++) {
                    let res = this.children[i].GetRef(name);
                    if (res) {
                        return res;
                    }
                }
            }
        }
        return null;
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
                    (this.doms[0] as HTMLElement).removeEventListener(
                        eventName,
                        this.attrs[key]
                    );
                } else {
                    RemoveAttr(this.doms[0] as HTMLElement, key, this.attrs[key]);
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
                    for (let key in oldStyle) {
                        if (!newStyle[key]) {
                            (this.doms[0] as HTMLElement).style[key] = '';
                        } else {
                            if (newStyle[key] != oldStyle[key]) {
                                (this.doms[0] as HTMLElement).style[key] =
                                    newStyle[key];
                            }
                        }
                    }
                    for (let key in newStyle) {
                        if (!oldStyle[key]) {
                            (this.doms[0] as HTMLElement).style[key] =
                                newStyle[key];
                        }
                    }
                    return;
                }
                if (isEvent) {
                    if (this.attrs[key] != newAttrs[key]) {
                        this.doms[0].removeEventListener(
                            eventName,
                            this.attrs[key]
                        );
                        this.doms[0].addEventListener(
                            eventName,
                            newAttrs[key]
                        );
                    }
                } else {
                    if (this.attrs[key] != newAttrs[key]) {
                        RemoveAttr(<HTMLElement>this.doms[0], key, this.attrs[key]);
                        ApplyAttr(
                            <HTMLElement>this.doms[0],
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
                    (this.doms[0] as HTMLElement).addEventListener(
                        eventName,
                        newAttrs[key]
                    );
                } else {
                    ApplyAttr(
                        <HTMLElement>this.doms[0],
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

            if (this.tag != 'fragment') {
                innerhtmls.push(`<${this.tag}`);
                Object.keys(this.attrs).forEach(key => {
                    let attrStr = SerializeAttr(key, this.attrs[key]);
                    if (attrStr) innerhtmls.push(' ' + attrStr);
                });
                innerhtmls.push('>');
            }

            this.children.forEach(child => {
                let res = child.ToHtml();
                innerhtmls.push(res);
            });
            if (this.tag != 'fragment') innerhtmls.push(`</${this.tag}>`);
            return innerhtmls.join('');
        }
    }
    ToDom(): (HTMLElement | Text)[] {
        if (typeof document == 'undefined') {
            return null;
        }
        if (this.type == 'custom') {
            let doms = this.mvvm.$ToDom();
            this.doms = doms;
            return doms;
        }
        if (this.type == 'standard') {
            if (this.tag != 'fragment') {
                let elem = document.createElement(this.tag);
                this.doms = [elem];
                Object.keys(this.attrs).forEach(key => {
                    let eventName = EventName(key);
                    if (eventName) {
                        elem.addEventListener(eventName, this.attrs[key]);
                    } else ApplyAttr(elem, key, this.attrs[key]);
                });
                this.children.forEach(child => {
                    let doms = child.ToDom();
                    doms.forEach(dom => elem.appendChild(dom));
                });
                return [elem];
            } else {
                let children: (HTMLElement | Text)[] = [];
                this.children.forEach(child => {
                    let doms = child.ToDom();
                    children = children.concat(doms);
                });
                this.doms = children;
                return children;
            }
        }
        if (this.type == 'text') {
            let text = document.createTextNode(this.text);
            this.doms = [text];
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
        this.doms = [dom];
        Object.keys(this.attrs).forEach(key => {
            let eventName = EventName(key);
            if (eventName) {
                dom.addEventListener(eventName, this.attrs[key]);
            }
        });
    }
    SetDom(doms: (HTMLElement | Text)[]) {
        this.doms = doms;
    }
}
