import { Diff } from './diff';
import { RegisterEvent, TriggerEvent, UnregisterEvent } from './event-center';
import { VNode } from './VNode';
import { React, GetId, Ref } from './react';
import { InsertQueue } from './refresh';
import Dev from "./dev";

export abstract class MVVM {
    private $root: VNode;
    private $attachedVNode: VNode;
    /**组件内部的事件注册中心 */
    private $eventRegister: { [event: string]: Function[] } = {};
    /**该组件拥有的子级虚拟树 */
    protected $children: VNode[] = [];
    private $isdirty = false;
    private $props: any;
    private $hasRenderedDom = false;
    private $mountDom: HTMLElement = null;
    private $isDestroyed = false;
    protected $id: number;

    constructor($props?: any) {
        if ($props != undefined)
            this.$props = $props;
        else
            this.$props = {};
        this.$watchObject(this.$props);
        this.$id = GetId();
    }
    /**渲染完成后该方法会被调用，此时elem成员变量才可以被访问到 */
    protected $didMounted(): void { }
    /**销毁函数 */
    protected $willUnMount(): void { }
    /**该组建的渲染方法，该方法必须返回一个虚拟树 */
    protected abstract $Render(): VNode;

    /**向所有父级发送消息 */
    protected $emitUp(event: string, ...data: any[]) {
        this.$root.EmitUp(event, ...data);
    }
    /**向所有子级发送消息 */
    protected $emitDown(event: string, ...data: any[]) {
        this.$root.EmitDown(event, ...data);
    }
    /**监听事件 */
    protected $on(
        event: string,
        callback: Function
    ) {
        if (!this.$eventRegister[event]) this.$eventRegister[event] = [];
        this.$eventRegister[event].push(callback);
        RegisterEvent(event, callback);
    }
    protected $cancel(event, callback?: Function) {
        if (!callback) {
            this.$eventRegister[event] = [];
        } else {
            if (this.$eventRegister[event]) {
                this.$eventRegister[event] = this.$eventRegister[event].filter(item => item !== callback);
            }
        }
        UnregisterEvent(event, callback);
    }
    /**发送一个全局事件 */
    protected $broadcast(event: string, ...data: any[]) {
        TriggerEvent(event, ...data);
    }
    /**触发该组件的某个事件监听 */
    $Trigger(event, ...data: any[]) {
        let cbs = this.$eventRegister[event];
        if (cbs) {
            cbs.forEach(cb => cb(...data));
        }
    }
    $ToDom(): (HTMLElement | Text)[] {
        if (this.$isdirty) {
            //remount时可能需要
            this.$root = this.$Render();
            this.$isdirty = false;
        }
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
            Dev.OnChange("update", [this]);
            React.ChangeMode('shallow');

            let old = React.target;
            React.target = this;
            let newroot = this.$Render();
            React.target = old;

            React.ChangeMode('deep');
            let same = MVVM.$compareVNode(this.$root, newroot);
            if (same) {
                this.$useOld(this.$root, newroot);
            }
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
                this.$root.Destroy();
                let oldmvvms = this.$root.GetAllMvvm();
                if (oldmvvms.length > 0)
                    Dev.OnChange("delete", oldmvvms);
                this.$root = newroot;
                if (this.$hasRenderedDom)
                    newroot.Rendered();

                let newmvvms = newroot.GetAllMvvm();
                if (newmvvms.length > 0)
                    Dev.OnChange("new", newmvvms, { isparent: true, id: this.$id });
            }
            this.$isdirty = false;
        }
    }

    $DoRender() {
        let keys = [];
        Object.keys(this).forEach(key => {
            if (!key.startsWith('$') && this[key] !== this.$props) keys.push(key);
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
        if (!(obj instanceof Ref) && !(obj instanceof VNode) && !(obj instanceof MVVM && (!keys || keys.length == 0)) && toString.call(obj) == '[object Object]' || toString.call(obj) == '[object Array]') {
            let watchers: MVVM[] = [];
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
    private $watchArray(arr, watchers: MVVM[]) {
        this.$overwriteArrayMethods(arr, 'pop', watchers);
        this.$overwriteArrayMethods(arr, 'push', watchers);
        this.$overwriteArrayMethods(arr, 'splice', watchers);
        this.$overwriteArrayMethods(arr, 'unshift', watchers);
        this.$overwriteArrayMethods(arr, 'shift', watchers);
    }
    private $overwriteArrayMethods(arr: any[], methodname: string, watchers: MVVM[]) {
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
            let instance = oldNode.GetMvvm();
            let newInstance = newNode.GetMvvm();
            instance.$resetProps(newInstance.$props);

            let samechildren = (instance.$children === newInstance.$children) || instance.$children.length == 0 && newInstance.$children.length == 0;
            if (!samechildren) {
                instance.$SetChildren(newInstance.$children);
                instance.$isdirty = true;
            }
            if (instance.$isdirty) {
                instance.$ApplyRefresh();
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
    $IsParentOf(mvvm: MVVM) {
        let parentNode = mvvm.$attachedVNode.GetParent();
        while (parentNode) {
            if (parentNode.GetMvvm() == this) {
                return true;
            }
            parentNode = parentNode.GetParent();
        }
        return false;
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
                    if (this.$hasRenderedDom) {
                        item.newValue.ToDom();
                    }
                    parent.InsertVNode(item.newValue, index, this.$hasRenderedDom);
                    this.$devNew(item.newValue, index);

                    if (this.$hasRenderedDom)
                        item.newValue.Rendered();
                }
                index++;
                return;
            }
            if (item.state == 'delete') {
                parent.RemoveVNode(item.oldValue, index, this.$hasRenderedDom && item.isdeprecated);
                this.$devDelete(item.oldValue);
                if (item.isdeprecated) {
                    item.oldValue.Destroy();
                }
                return;
            }
            if (item.state == 'replace') {
                parent.RemoveVNode(item.oldValue, index, this.$hasRenderedDom && item.isdeprecated);
                this.$devDelete(item.oldValue);
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
                    this.$devNew(item.newValue, index);
                    if (this.$hasRenderedDom)
                        item.newValue.Rendered();
                }
                index++;
            }
        });
    }
    private $devDelete(vnode: VNode) {
        let mvvms = vnode.GetAllMvvm();
        if (mvvms.length > 0) {
            Dev.OnChange("delete", mvvms);
        }
    }

    private $devNew(vnode: VNode, index) {
        let mvvms = vnode.GetAllMvvm();
        if (mvvms.length > 0) {
            let nextmvvm = null;
            let parent = vnode.GetParent();
            if (parent.GetChildren().length - 1 > index) {
                let nextsibling = parent.GetChildren()[index + 1];
                nextmvvm = nextsibling.GetFirstChildMvvm();
                if (nextmvvm)
                    Dev.OnChange("new", mvvms, { isparent: false, id: nextmvvm.$id });
            }
            if (!nextmvvm)
                Dev.OnChange("new", mvvms, { isparent: true, id: parent.GetNearestAncestorMvvm().$id });
        }
    }
    private $resetProps(props) {
        if (this.$props && Object.prototype.toString.call(this.$props) == "[object Object]") {
            if (props && Object.prototype.toString.call(props) == "[object Object]") {
                let oldkeys = Object.keys(this.$props);
                let newkeys = Object.keys(props);
                oldkeys.forEach(key => {
                    if (newkeys.indexOf(key) != -1) {
                        this.$setProp(key, props[key]);
                    } else {
                        this.$props[key] = undefined;
                    }
                });
                newkeys.forEach(key => {
                    if (oldkeys.indexOf(key) == -1) {
                        this.$props[key] = props[key];
                        this.$watchObject(this.$props, [key]);
                    }
                });
            }
        }
    }
    private $setProp(key, value) {
        let oldvalue = this.$props[key];
        if (typeof oldvalue == 'function' && typeof value == 'function') {
            if (typeof oldvalue.prototype != 'undefined' && typeof value.prototype != 'undefined') {
                if (typeof oldvalue.toString == 'function' && typeof value.toString == 'function' && oldvalue.toString() == value.toString()) {
                    return;
                }
            }
            this.$props[key] = value;
            return;
        }
        if (Object.prototype.toString.call(oldvalue) == '[object RegExp]' && Object.prototype.toString.call(value) == '[object RegExp]' && oldvalue.toString() == value.toString()) {
            return;
        }
        this.$props[key] = value;
    }

    $Rendered() {
        this.$isDestroyed = false;
        this.$root.Rendered();
        this.$didMounted();
    }
    $Destroy() {
        this.$isDestroyed = true;
        this.$willUnMount();
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
        Dev.AddMvvm(this);
    }
    $GetMountDom() {
        return this.$mountDom;
    }
    $GetAttachedVNode() {
        return this.$attachedVNode;
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
                left.GetMvvm().constructor !=
                right.GetMvvm().constructor
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
    $GetProps() {
        return this.$props;
    }
}
