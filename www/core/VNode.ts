import { ApplyAttr, SerializeAttr, GetEventAttrName } from "./attribute";
import { MVVM } from "./MVVM";
import { Diff } from "./diff";

export class VNode {
    /**虚拟节点名称，即标准html的标签名 */
    protected tag: string = "";
    private text:string="";
    /**子节点 */
    protected children: VNode[] = [];
    /**属性集合 */
    private attrs: { name: string, value: any }[] = [];
    /**父节点 */
    private parent: VNode = null;

    /**关联的组件实例，当type='custom'有效 */
    private instance: MVVM<any>;
    /**关联的实际dom元素 */
    private dom: (HTMLElement | Text);
    /**节点类型 */
    private type: "standard" | "custom" | "text";
    /**是否已经被销毁 */
    private isDestroyed=false;


    constructor(type: "standard" | "custom" |"text") {
        this.type = type;
    }
    SetTag(tag: string) {
        this.tag = tag;
    }
    GetTag() {
        return this.tag;
    }
    GetText(){
        return this.text;
    }
    SetText(text:string){
        this.text=text;
    }
    SetInstance(component: MVVM<any>) {
        this.instance = component;
    }
    GetInstance() {
        return this.instance;
    }
    GetParent() {
        return this.parent;
    }
    /**在索引为index位置增加一个child,index=-1表示在末尾添加，注意会引发实际的dom操作 */
    InsertVNode(child: VNode, index: number) {
        //dom操作
        let doms = child.ToDom();
        let sibling:(HTMLElement|Text)=null;
        while(this.children[index]){
            let subdoms=this.children[index].ToDom();
            if(subdoms.length>0){
                sibling=subdoms[0];
                break;
            }else{
                index++;
            }
        }
        if(sibling){
            doms.forEach(dom=>{
                sibling.parentNode.insertBefore(dom,sibling);
            });
        }else{
            let top=this.getDomUpward();
            doms.forEach(dom=>{
                top.appendChild(dom);
            });
        }
        //虚拟dom操作
        this.children.splice(index,0,child);
        child.parent = this;
        
        child.Rendered();
    }
    private getDomUpward():HTMLElement|Text{
        if(this.type=='standard'){
            if(this.tag=="fragment"){
                return this.parent.getDomUpward();
            }else{
                return this.ToDom()[0];
            }
        }
        if(this.type=="custom"){
            return this.parent.getDomUpward();
        }
        throw new Error('getDomUpward error');
    }
    /**末尾添加一个孩子节点，不包含dom操作 */
    AppendChild(child: VNode) {
        child.parent = this;
        this.children.push(child);
    }
    /**移除一个孩子节点，注意会引发dom操作 */
    RemoveVNode(child: VNode) {
        child.Destroy();
        let index = this.children.indexOf(child);
        this.children.splice(index, 1);
        let doms=child.ToDom();
        doms.forEach(dom=>{
            dom.parentNode.removeChild(dom);
        });
    }
    Destroy(){
        this.isDestroyed=true;
        if(this.instance){
            this.instance.onDestroyed();
        }
        this.children.forEach(child=>{
            child.Destroy();
        });
    }
    GetChildren() {
        return this.children;
    }
    /**渲染完毕后的回调 */
    Rendered() {
        if (this.type == "custom")
            this.instance.onRendered();
        if (this.type == "standard") {
            this.children.forEach(child => {
                child.Rendered();
            });
        }
    }
    GetType() {
        return this.type;
    }

    SetAttr(name: string, value: any) {
        let exist = false;
        for (let i = 0; i < this.attrs.length; i++) {
            let attr = this.attrs[i];
            if (attr.name == name) {
                attr.value = value;
                exist = true;
                break;
            }
        }
        if (!exist) {
            this.attrs.push({ name: name, value: value });
        }
    }
    GetAttr(name: string) {
        for (let i = 0; i < this.attrs.length; i++) {
            let attr = this.attrs[i];
            if (attr.name == name)
                return attr.value;
        }
        return null;
    }
    GetAttrs() {
        return this.attrs;
    }
    ApplyAttrDiff(newAttrs: { name: string, value: any }[]) {
        let res = Diff<{ name: string, value: any }>(this.attrs, newAttrs, VNode.compairAttr);
        res.forEach(item => {
            let eventName = GetEventAttrName(item.value.name);
            let isEvent=eventName!=null;
            if (item.state == "delete") {
                if (isEvent) {
                    (this.dom as HTMLElement).removeEventListener(eventName, item.value.value);
                } else {
                    (this.dom as HTMLElement).removeAttribute(item.value.name);
                }
                return;
            }
            if (item.state == "new") {
                if(isEvent){
                    (this.dom as HTMLElement).addEventListener(eventName,item.value.value);
                }else{
                    ApplyAttr(<HTMLElement>this.dom, item.value.name, item.value.value);
                }
                return;
            }
            if(item.state=="replace"){
                if (isEvent) {
                    (this.dom as HTMLElement).removeEventListener(eventName, item.value.value);
                    (this.dom as HTMLElement).addEventListener(eventName,item.newValue.value);
                } else {
                    (this.dom as HTMLElement).removeAttribute(item.value.name);
                    ApplyAttr(<HTMLElement>this.dom, item.value.name, item.newValue.value);
                }
                return;
            }
            if (item.state == "old") {
                if (item.value.name == "style" &&
                    toString.call(item.value.value) == "[object Object]" &&
                    toString.call(item.newValue.value) == "[object Object]") {
                    let oldStyle = item.value.value;
                    let newStyle = item.newValue.value;
                    for (let key in oldStyle) {
                        if (!newStyle[key]) {
                            (this.dom as HTMLElement).style[key] = "";
                        } else {
                            if (newStyle[key] != oldStyle[key]) {
                                (this.dom as HTMLElement).style[key] = newStyle[key];
                            }
                        }
                    }
                    for (let key in newStyle) {
                        if (!oldStyle[key]) {
                            (this.dom as HTMLElement).style[key] = newStyle[key];
                        }
                    }
                    return;
                }
                if (isEvent) {
                    if (item.value.value != item.newValue.value) {
                        this.dom.removeEventListener(eventName, item.value.value);
                        this.dom.addEventListener(eventName, item.newValue.value);
                    }
                } else {
                    if (item.value.value != item.newValue.value) {
                        ApplyAttr(<HTMLElement>this.dom, item.value.name, item.newValue.value);
                    }
                }
                return;
            }
        });
        this.attrs = newAttrs;
    }
    private static compairAttr(left: { name: string, value: any }, right: { name: string, value: any }): boolean {
        if (left.name == right.name)
            return true;
        else
            return false;
    }
    ToHtml(): string {
        if (this.type == "text")
            return this.text;
        if (this.type == "custom") {
            let html = this.instance.$ToHtml();
            return html;
        }
        if (this.type == "standard") {
            let innerhtmls: string[] = [];

            if(this.tag!="fragment"){
                innerhtmls.push(`<${this.tag}`);
                this.attrs.forEach(attr => {
                    let attrStr = SerializeAttr(attr.name, attr.value);
                    if (attrStr)
                        innerhtmls.push(" "+attrStr);
                });
                innerhtmls.push(">");
            }
            
            this.children.forEach(child => {
                let res = child.ToHtml();
                innerhtmls.push(res);
            });
            if(this.tag!="fragment")
                innerhtmls.push(`</${this.tag}>`);
            return innerhtmls.join("");
        }
    }
    ToDom(): (HTMLElement | Text)[] {
        if (this.type == "custom") {
            let doms = this.instance.$ToDom();
            return doms;
        }
        if (this.type == "standard") {
            if(this.tag!="fragment"){
                if(this.dom)
                    return [this.dom];
                let elem = document.createElement(this.tag);
                this.dom = elem;
                this.attrs.forEach(attr => {
                    let eventName=GetEventAttrName(attr.name);
                    if(eventName){
                        elem.addEventListener(eventName,attr.value);
                    }else
                        ApplyAttr(elem, attr.name, attr.value);
                });
                this.children.forEach(child => {
                    let doms = child.ToDom();
                    doms.forEach(dom=>elem.appendChild(dom));
                });
                return [elem];
            }else{
                let children:(HTMLElement|Text)[]=[];
                this.children.forEach(child => {
                    let doms = child.ToDom();
                    children=children.concat(doms);
                });
                return children;
            }
        }
        if (this.type == "text") {
            if(this.dom)
                return [this.dom];
            let text = document.createTextNode(this.text);
            this.dom = text;
            return [text];
        }
    }
    Emit(event: string, ...data: any[]) {
        if (this.parent) {
            if (this.parent.type == "custom")
                this.parent.instance.$Trigger(event, ...data);
            this.parent.Emit(event, ...data);
        }
    }
    BroadCast(event: string, ...data: any[]) {
        this.children.forEach(child => {
            if (child.type == "custom") {
                child.instance.$Trigger(event, ...data);
            }
            child.BroadCast(event, ...data);
        });
    }

    AttachDom(dom: HTMLElement | Text) {
        this.dom = dom;
        this.attrs.forEach(attr => {
            let eventName=GetEventAttrName(attr.name);
            if(eventName){
                dom.addEventListener(eventName,attr.value);
            }
        });
    }
}