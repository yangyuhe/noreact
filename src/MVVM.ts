import { Diff } from './diff';
import { RegisterEvent, TriggerEvent } from './event-center';
import { VNode } from './VNode';
import NoReact from './noreact';
import { InsertQueue } from './refresh';
export abstract class MVVM<T> {
    private $root: VNode;
    private $attachedVNode: VNode;
    /**组件内部的事件注册中心 */
    private $eventRegister: { [event: string]: Function[] } = {};
    /**组件的名称，使用@Component装饰器设置该值 */
    public $Name: string;
    /**该组件拥有的子级虚拟树 */
    protected $children: VNode[] = [];
    private $isdirty = false;
    private $refs: { [key: string]: VNode } = {};
    protected $props: T;
    private hasRenderedDom = false;

    constructor($props: T) {
        if (toString.call($props) == '[object Object]') {
            this.$props = $props;
            this.watchObject(this.$props);
        }
    }
    /**初始化函数 */
    protected onInit(): void { }
    /**渲染完成后该方法会被调用，此时elem成员变量才可以被访问到 */
    protected onRendered(): void { }
    /**销毁函数 */
    protected onDestroyed(): void { }
    /**该组建的渲染方法，该方法必须返回一个虚拟树 */
    protected abstract Render(): VNode;

    /**向所有父级发送消息 */
    protected $emitUp<Message>(event: string, data?: Message) {
        this.$root.EmitUp(event, data, this);
    }
    /**向所有子级发送消息 */
    protected $emitDown<Message>(event: string, data?: Message) {
        this.$root.EmitDown(event, data, this);
    }
    /**监听事件 */
    protected $on<Message>(
        event: string,
        callback: (data: Message, target: MVVM<any>) => void
    ) {
        if (!this.$eventRegister[event]) this.$eventRegister[event] = [];
        this.$eventRegister[event].push(callback);
        RegisterEvent(event, callback);
    }
    /**发送一个全局事件 */
    protected $broadcast<Message>(event: string, data?: Message) {
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
        this.hasRenderedDom = true;
        if (!this.$root) this.$DoRender();
        let dom = this.$root.ToDom();
        return dom;
    }
    $ToHtml(): string {
        return this.Render().ToHtml();
    }
    $GetRoot() {
        if (!this.$root) this.$DoRender();
        return this.$root;
    }

    /**设置该组件的子级虚拟树 */
    $SetChildren(children: VNode[]) {
        this.$children = children;
    }
    $Dirty() {
        if (!this.$isdirty) {
            this.$isdirty = true;
            InsertQueue(this);
        }
    }
    $ApplyRefresh() {
        if (this.$isdirty) {
            NoReact.ChangeMode('shallow');

            let old = NoReact.target;
            NoReact.target = this;
            let newroot = this.Render();
            NoReact.target = old;

            NoReact.ChangeMode('deep');
            this.$diff([this.$root], [newroot], this.$root.GetParent());
            this.$isdirty = false;
        }
    }
    $Ref(name: string): (MVVM<any> | HTMLElement) {
        let ref = this.$refs[name];
        if (ref && !ref.IsDestroyed()) {
            if (ref.GetInstance())
                return ref.GetInstance();
            else
                return ref.GetDom() && ref.GetDom()[0] as HTMLElement;
        }
        let res = this.$root.GetRef(name);
        if (!res)
            return null;
        this.$refs[name] = res;
        if (res.GetInstance())
            return res.GetInstance();
        else
            return ref.GetDom() && res.GetDom()[0] as HTMLElement;
    }
    $DoRender() {
        this.onInit();
        let keys = [];
        Object.keys(this).forEach(key => {
            if (!key.startsWith('$')) keys.push(key);
        });
        keys.length > 0 && this.watchObject(this, keys);

        let old = NoReact.target;
        NoReact.target = this;
        this.$root = this.Render();
        if (!this.$attachedVNode) {
            this.$attachedVNode = new VNode("custom");
            this.$attachedVNode.SetMvvm(this);
        }
        this.$root.SetParent(this.$attachedVNode);
        NoReact.target = old;
        return this.$root;
    }
    private watchObject(obj: any, keys?: string[]) {
        if (toString.call(obj) == '[object Object]' || toString.call(obj) == '[object Array]') {
            let watchers: MVVM<any>[] = [];
            ((keys && keys.length > 0 && keys) || Object.keys(obj)).forEach(key => {
                let descriptor = Object.getOwnPropertyDescriptor(obj, key);
                if (descriptor && descriptor.configurable) {
                    let value = obj[key];
                    Object.defineProperty(obj, key, {
                        get: () => {
                            if (
                                NoReact.target &&
                                watchers.indexOf(NoReact.target)
                            ) {
                                watchers.push(NoReact.target);
                            }
                            return value;
                        },
                        set: val => {
                            if (val != value) {
                                watchers.forEach(item => item.$Dirty());
                                value = val;

                                if (toString.call(value) == "[object Array]")
                                    this.watchArray(value, watchers);
                                this.watchObject(value);
                            }
                        },
                        configurable: false,
                        enumerable: true
                    });
                    if (toString.call(value) == "[object Array]")
                        this.watchArray(value, watchers);
                    this.watchObject(value);
                }
            });
            return;
        }
    }
    private watchArray(arr, watchers: MVVM<any>[]) {
        this.overwriteArrayMethods(arr, 'pop', watchers);
        this.overwriteArrayMethods(arr, 'push', watchers);
        this.overwriteArrayMethods(arr, 'splice', watchers);
        this.overwriteArrayMethods(arr, 'unshift', watchers);
        this.overwriteArrayMethods(arr, 'shift', watchers);
    }
    private overwriteArrayMethods(arr: any[], methodname: string, watchers: MVVM<any>[]) {
        let method = arr[methodname];
        if (typeof method == 'function') {
            Object.defineProperty(arr, methodname, {
                value: function () {
                    watchers.forEach(item => item.$Dirty());
                    return method.apply(this, arguments);
                },
                configurable: false
            });
        }
    }
    private useOld(oldNode: VNode, newNode: VNode) {
        if (oldNode.GetType() == 'custom') {
            let instance = oldNode.GetInstance();
            let newInstance = newNode.GetInstance();
            if (instance.$isdirty) {
                instance.$props = newInstance.$props;
                instance.watchObject(instance.$props);
                instance.$ApplyRefresh();
            } else {
                Object.assign(
                    instance.$props,
                    newInstance.$props
                );
            }
            return;
        }
        if (oldNode.GetType() == 'standard') {
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
    private $diff(olds: VNode[], news: VNode[], parent: VNode) {
        let opers = Diff(olds, news, MVVM.$compareVNode);

        let index = 0;
        opers.forEach(item => {
            if (item.state == 'old') {
                index++;
                this.useOld(item.oldValue, item.newValue);
                return;
            }
            if (item.state == 'new') {
                if (item.newValueOrigin) {
                    this.useOld(item.newValueOrigin, item.newValue);
                    parent.InsertVNode(item.newValueOrigin, index);
                } else {
                    if (this.hasRenderedDom)
                        item.newValue.ToDom();
                    parent.InsertVNode(item.newValue, index);
                    if (this.hasRenderedDom)
                        item.newValue.Rendered();
                }
                index++;
                return;
            }
            if (item.state == 'delete') {
                parent.RemoveVNode(item.oldValue, index, item.isdeprecated);
                if (item.isdeprecated) {
                    item.oldValue.Destroy();
                }
                return;
            }
            if (item.state == 'replace') {
                parent.RemoveVNode(item.oldValue, index, item.isdeprecated);
                if (item.isdeprecated) {
                    item.oldValue.Destroy();
                }
                if (item.newValueOrigin) {
                    this.useOld(item.newValueOrigin, item.newValue);
                    parent.InsertVNode(item.newValueOrigin, index);
                } else {
                    if (this.hasRenderedDom)
                        item.newValue.ToDom();
                    parent.InsertVNode(item.newValue, index);
                    if (this.hasRenderedDom)
                        item.newValue.Rendered();
                }
                index++;
            }
        });
    }
    $Rendered() {
        this.$root.Rendered();
        this.onRendered();
    }
    $Destroy() {
        this.onDestroyed();
        this.$root.Destroy();
    }
    $AttachVNode(vnode: VNode) {
        this.$attachedVNode = vnode;
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
export interface MVVMConstructor<T> {
    new(params: T): MVVM<T>;
}

let reactiveCache: any = {};
export function Reactive(proto, propertyName) {
    if (!proto.$symbol) {
        proto.$symbol = Symbol();
    }
    if (!reactiveCache[proto.$symbol]) {
        reactiveCache[proto.$symbol] = [];
    }
    reactiveCache[proto.$symbol].push(propertyName);
}
