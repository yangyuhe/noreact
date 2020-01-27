import { Diff } from './diff';
import { RegisterEvent, TriggerEvent } from './event-center';
import { VNode } from './VNode';
import { React } from './react';
import { InsertQueue } from './refresh';

export abstract class MVVM<T> {
    private $root: VNode;
    private $attachedVNode: VNode;
    /**组件内部的事件注册中心 */
    private $eventRegister: { [event: string]: Function[] } = {};
    /**该组件拥有的子级虚拟树 */
    protected $children: VNode[] = [];
    private $isdirty = false;
    protected $props: T;
    private $hasRenderedDom = false;
    private $mountDom: HTMLElement = null;
    private $isDestroyed = false;

    constructor($props: T) {
        if (toString.call($props) == '[object Object]') {
            this.$props = $props;
        } else {
            (this.$props as any) = {};
        }
    }
    /**初始化函数 */
    protected $onInit(): void { }
    /**渲染完成后该方法会被调用，此时elem成员变量才可以被访问到 */
    protected $onRendered(): void { }
    /**销毁函数 */
    protected $onDestroyed(): void { }
    /**该组建的渲染方法，该方法必须返回一个虚拟树 */
    protected abstract $Render(): VNode;

    /**向所有父级发送消息 */
    protected $emitUp(event: string, data?: any) {
        this.$root.EmitUp(event, data, this);
    }
    /**向所有子级发送消息 */
    protected $emitDown(event: string, data?: any) {
        this.$root.EmitDown(event, data, this);
    }
    /**监听事件 */
    protected $on(
        event: string,
        callback: (data: any, target: MVVM<any>) => void
    ) {
        if (!this.$eventRegister[event]) this.$eventRegister[event] = [];
        this.$eventRegister[event].push(callback);
        RegisterEvent(event, callback);
    }
    /**发送一个全局事件 */
    protected $broadcast(event: string, data?: any) {
        TriggerEvent(event, this, data);
    }
    /**触发该组件的某个事件监听 */
    $Trigger(event, ...data: any[]) {
        let cbs = this.$eventRegister[event];
        if (cbs) {
            cbs.forEach(cb => cb(...data));
        }
    }
    $ToDom(): (HTMLElement | Text)[] {
        this.$hasRenderedDom = true;
        if (!this.$root) this.$DoRender();
        let doms = this.$root.ToDom();
        return doms;
    }
    $ToHtml(): string {
        return this.$Render().ToHtml();
    }
    $GetRoot() {
        if (!this.$root) this.$DoRender();
        return this.$root;
    }

    $SetChildren(children: VNode[]) {
        this.$children = children;
    }
    $GetChildren() {
        return this.$children;
    }
    $Dirty() {
        if (!this.$isdirty) {
            this.$isdirty = true;
            InsertQueue(this);
        }
    }
    $GetDirty() {
        return this.$isdirty;
    }
    $ApplyRefresh() {
        if (this.$isdirty) {
            React.ChangeMode('shallow');

            let old = React.target;
            React.target = this;
            let newroot = this.$Render();
            React.target = old;

            React.ChangeMode('deep');
            let same = MVVM.$compareVNode(this.$root, newroot);
            if (same)
                this.$useOld(this.$root, newroot);
            else {
                if (this.$hasRenderedDom) {
                    let doms = newroot.ToDom();
                    let res = this.$root.GetParent().GetSiblingDom(this.$root);
                    if (res.isparent) {
                        (res.dom as HTMLElement).append(...doms);
                    } else {
                        doms.forEach(dom => {
                            res.dom.parentNode.insertBefore(dom, res.dom);
                        });
                    }
                    this.$root.Doms.forEach(dom => {
                        dom.remove();
                    });
                }
                this.$root.GetParent().isMulti = newroot.isMulti;
                newroot.SetParent(this.$root.GetParent());
                this.$root = newroot;
                if (this.$hasRenderedDom)
                    newroot.Rendered();
            }
            this.$isdirty = false;
        }
    }

    $DoRender() {
        this.$onInit();
        let keys = [];
        Object.keys(this).forEach(key => {
            if (!key.startsWith('$')) keys.push(key);
        });
        keys.length > 0 && this.$watchObject(this, keys);

        let old = React.target;
        React.target = this;
        this.$root = this.$Render();
        if (!this.$attachedVNode) {
            this.$attachedVNode = new VNode("custom");
            this.$attachedVNode.SetMvvm(this);
        }
        this.$attachedVNode.isMulti = this.$root.isMulti;
        this.$root.SetParent(this.$attachedVNode);
        React.target = old;
        return this.$root;
    }
    private $watchObject(obj: any, keys?: string[]) {
        if (toString.call(obj) == '[object Object]' || toString.call(obj) == '[object Array]') {
            let watchers: MVVM<any>[] = [];
            ((keys && keys.length > 0 && keys) || Object.keys(obj)).forEach(key => {
                let descriptor = Object.getOwnPropertyDescriptor(obj, key);
                if (descriptor && descriptor.configurable) {
                    let value = obj[key];
                    Object.defineProperty(obj, key, {
                        get: () => {
                            if (
                                React.target &&
                                watchers.indexOf(React.target)
                            ) {
                                watchers.push(React.target);
                            }
                            return value;
                        },
                        set: val => {
                            if (val != value) {
                                watchers.forEach(item => item.$Dirty());
                                value = val;

                                if (toString.call(value) == "[object Array]")
                                    this.$watchArray(value, watchers);
                                this.$watchObject(value);
                            }
                        },
                        configurable: false,
                        enumerable: true
                    });
                    if (toString.call(value) == "[object Array]")
                        this.$watchArray(value, watchers);
                    this.$watchObject(value);
                }
            });
            return;
        }
    }
    private $watchArray(arr, watchers: MVVM<any>[]) {
        this.$overwriteArrayMethods(arr, 'pop', watchers);
        this.$overwriteArrayMethods(arr, 'push', watchers);
        this.$overwriteArrayMethods(arr, 'splice', watchers);
        this.$overwriteArrayMethods(arr, 'unshift', watchers);
        this.$overwriteArrayMethods(arr, 'shift', watchers);
    }
    private $overwriteArrayMethods(arr: any[], methodname: string, watchers: MVVM<any>[]) {
        let method = arr[methodname];
        if (typeof method == 'function') {
            let descriptor = Object.getOwnPropertyDescriptor(arr, methodname);
            if (!descriptor || descriptor.configurable) {
                Object.defineProperty(arr, methodname, {
                    value: function () {
                        watchers.forEach(item => item.$Dirty());
                        return method.apply(this, arguments);
                    },
                    configurable: false
                });
            }
        }
    }
    private $useOld(oldNode: VNode, newNode: VNode) {
        if (oldNode.GetType() == 'custom') {
            let instance = oldNode.GetInstance();
            let newInstance = newNode.GetInstance();
            if (instance.$isdirty) {
                instance.$props = newInstance.$props;
                instance.$SetChildren(newInstance.$children);
                instance.$ApplyRefresh();
            } else {
                let same = this.$compareProps(instance.$props, newInstance.$props) && this.$compareChildren(instance.$children, newInstance.$children);
                if (!same) {
                    instance.$props = newInstance.$props;
                    instance.$SetChildren(newInstance.$children);
                    instance.$isdirty = true;
                    instance.$ApplyRefresh();
                }
            }
            return;
        }
        if (oldNode.GetType() == 'standard' || oldNode.GetType() == 'fragment') {
            if (oldNode.GetType() == 'standard')
                oldNode.ApplyAttrDiff(newNode.GetAttrs());
            this.$diff(
                oldNode.GetChildren(),
                newNode.GetChildren(),
                oldNode
            );
            return;
        }
        if (oldNode.GetType() == 'text') {
            return;
        }
    }
    $IsParentOf(mvvm: MVVM<any>) {
        let parentNode = mvvm.$attachedVNode.GetParent();
        while (parentNode) {
            if (parentNode.GetInstance() == this) {
                return true;
            }
            parentNode = parentNode.GetParent();
        }
        return false;
    }
    /**
     * 对比属性值，相同返回true,不相同返回false
     */
    private $compareProps(ps1: { [key: string]: any }, ps2: { [key: string]: any }) {
        if (toString.call(ps1) == "[object Object]" && toString.call(ps2) == "[object Object]") {
            let keys1 = Object.keys(ps1);
            let keys2 = Object.keys(ps2);
            let map = {};
            keys1.forEach(key => {
                map[key] = 1;
            });
            keys2.forEach(key => {
                if (!map[key])
                    map[key] = 1;
                else
                    map[key]++;
            });
            let different = false;
            Object.keys(map).forEach(key => {
                if (map[key] != 2) {
                    different = true;
                }
            });
            if (different)
                return false;
            else {
                for (let i = 0; i < keys1.length; i++) {
                    let key = keys1[i];
                    let res = this.$compareProp(ps1[key], ps2[key]);
                    if (!res)
                        return false;
                }
                return true;
            }
        }
        return false;
    }
    private $compareChildren(c1, c2) {
        if (c1 instanceof Array && c2 instanceof Array && c1.length == 0 && c2.length == 0)
            return true;
        return c1 === c2;
    }
    private $compareProp(p1, p2) {
        if (typeof p1 == 'function' && typeof p2 == 'function') {
            if (typeof p1.prototype != 'undefined' && typeof p2.prototype != 'undefined') {
                if (typeof p1.toString == 'function' && typeof p2.toString == 'function' && p1.toString() == p2.toString()) {
                    return true;
                }
                return false;
            }
        }
        if (p1 !== p2)
            return false;
        return true;
    }
    private $diff(olds: VNode[], news: VNode[], parent: VNode) {
        let opers = Diff(olds, news, MVVM.$compareVNode);
        let index = 0;
        opers.forEach(item => {
            if (item.state == 'old') {
                index++;
                this.$useOld(item.oldValue, item.newValue);
                return;
            }
            if (item.state == 'new') {
                if (item.newValueOrigin) {
                    this.$useOld(item.newValueOrigin, item.newValue);
                    parent.InsertVNode(item.newValueOrigin, index, this.$hasRenderedDom);
                } else {
                    if (this.$hasRenderedDom)
                        item.newValue.ToDom();
                    parent.InsertVNode(item.newValue, index, this.$hasRenderedDom);
                    if (this.$hasRenderedDom)
                        item.newValue.Rendered();
                }
                index++;
                return;
            }
            if (item.state == 'delete') {
                parent.RemoveVNode(item.oldValue, index, this.$hasRenderedDom && item.isdeprecated);
                if (item.isdeprecated) {
                    item.oldValue.Destroy();
                }
                return;
            }
            if (item.state == 'replace') {
                parent.RemoveVNode(item.oldValue, index, this.$hasRenderedDom && item.isdeprecated);
                if (item.isdeprecated) {
                    item.oldValue.Destroy();
                }
                if (item.newValueOrigin) {
                    this.$useOld(item.newValueOrigin, item.newValue);
                    parent.InsertVNode(item.newValueOrigin, index, this.$hasRenderedDom);
                } else {
                    if (this.$hasRenderedDom)
                        item.newValue.ToDom();
                    parent.InsertVNode(item.newValue, index, this.$hasRenderedDom);
                    if (this.$hasRenderedDom)
                        item.newValue.Rendered();
                }
                index++;
            }
        });
    }
    $Rendered() {
        this.$root.Rendered();
        this.$onRendered();
    }
    $Destroy() {
        this.$isDestroyed = true;
        this.$onDestroyed();
        this.$root.Destroy();
    }
    $IsDestroyed() {
        return this.$isDestroyed;
    }
    $AttachVNode(vnode: VNode) {
        this.$attachedVNode = vnode;
    }
    $AppendTo(elem: string | HTMLElement) {
        let dom: HTMLElement;
        if (typeof elem == 'string') {
            dom = document.querySelector(elem);
        } else {
            dom = elem;
        }
        dom.append(...this.$ToDom());
        this.$mountDom = dom;
        this.$Rendered();
    }
    $GetMountDom() {
        return this.$mountDom;
    }
    static $compareVNode(left: VNode, right: VNode) {
        if (left.GetAttr('key') != right.GetAttr('key')) {
            return false;
        }
        if (left.GetType() != right.GetType()) {
            return false;
        }
        if (left.GetType() == 'custom') {
            if (
                left.GetInstance().constructor !=
                right.GetInstance().constructor
            ) {
                return false;
            }
        }
        if (left.GetType() == 'standard') {
            if (left.GetTag() != right.GetTag()) return false;
        }
        if (left.GetType() == 'text') {
            if (left.GetText() != right.GetText()) return false;
        }
        return true;
    }
}
