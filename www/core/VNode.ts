import { ApplyAttr, AttachEventListener, SerializeAttr, GetEventAttrName } from "./attribute";
import { BaseComponent } from "./BaseComponent";
import { Diff } from "./diff";

export class VNode {
    /**虚拟节点名称，即标准html的标签名 */
    protected tag: string = "";
    /**子节点 */
    protected children: VNode[] = [];
    /**属性集合 */
    private attrs: { name: string, value: any }[] = [];
    /**父节点 */
    private parent: VNode = null;

    /**关联的组件实例，当type='custom'有效 */
    private instance: BaseComponent<any>;
    /**关联的实际dom元素 */
    private dom: (HTMLElement | Text);
    /**节点类型 */
    private type: "element" | "text" | "custom";
    /**当时type='text'时这个值才有意义，表示text的内容 */
    private text: string = "";
    /**是否已经被销毁 */
    private isDestroyed=false;


    constructor(type: "element" | "text" | "custom") {
        this.type = type;
    }
    SetTag(tag: string) {
        this.tag = tag;
    }
    GetTag() {
        return this.tag;
    }
    SetText(text: string) {
        this.text = text;
    }
    GetText() {
        return this.text;
    }
    SetInstance(component: BaseComponent<any>) {
        this.instance = component;
    }
    GetInstance() {
        return this.instance;
    }
    GetParent() {
        return this.parent;
    }
    /**在索引为index位置增加一个child,index=-1表示在末尾添加，注意会引发实际的dom操作 */
    InsertChild(child: VNode, index: number) {
        //dom操作
        let doms = child.ToDom();
        let sibling:(HTMLElement|Text)=null;
        while(this.children[index]){
            let subdoms=this.children[index].getClosestBottomDom();
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
            let top=this.getClosestTopDom();
            doms.forEach(dom=>{
                top.appendChild(dom);
            });
        }
        //虚拟dom操作
        this.children.splice(index,0,child);
        child.parent = this;
        
        child.Rendered();
    }
    private getClosestTopDom():(HTMLElement|Text){
        if(this.dom)
            return this.dom;
        else
            return this.parent.getClosestTopDom();
    }
    private getClosestBottomDom():(HTMLElement|Text)[]{
        if(this.dom)
            return [this.dom];
        else{
            let children=[];
            this.children.forEach(child=>{
                children=children.concat(child.getClosestBottomDom());
            });
            return children;
        }
    }
    /**末尾添加一个孩子节点，不包含dom操作 */
    AppendVChild(child: VNode) {
        child.parent = this;
        this.children.push(child);
    }
    /**移除一个孩子节点，注意会引发dom操作 */
    RemoveVChild(child: VNode) {
        child.Destroy();
        let index = this.children.indexOf(child);
        this.children.splice(index, 1);
        let doms=child.getClosestBottomDom();
        doms.forEach(dom=>{
            dom.parentNode.removeChild(dom);
        });
    }
    Destroy(){
        this.isDestroyed=true;
        if(this.instance){
            this.instance.$Destroyed();
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
            this.instance.$Rendered();
        if (this.type == "element") {
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
            if (item.state == "delete") {
                let event = GetEventAttrName(item.value.name);
                if (event) {
                    (this.dom as HTMLElement).removeEventListener(event, item.value.value);
                } else {
                    (this.dom as HTMLElement).removeAttribute(item.value.name);
                }
                return;
            }
            if (item.state == "new") {
                ApplyAttr(<HTMLElement>this.dom, item.value.name, item.value.value);
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
                let event = GetEventAttrName(item.value.name);
                if (event) {
                    if (item.value.value != item.newValue.value) {
                        this.dom.removeEventListener(event, item.value.value);
                        this.dom.addEventListener(event, item.newValue.value);
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
        if (this.type == "element") {
            let innerhtmls: string[] = [];

            if(this.tag!="fragment"){
                innerhtmls.push(`<${this.tag} `);
                this.attrs.forEach(attr => {
                    let attrStr = SerializeAttr(attr.name, attr.value);
                    if (attrStr)
                        innerhtmls.push(attrStr + " ");
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
        if (this.type == "element") {
            if(this.tag!="fragment"){
                let elem = document.createElement(this.tag);
                this.dom = elem;
                this.attrs.forEach(attr => {
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
            if (child instanceof VNode) {
                if (child.type == "custom") {
                    child.instance.$Trigger(event, ...data);
                }
                child.BroadCast(event, ...data);
            }
        });
    }

    AttachDom(dom: HTMLElement | Text) {
        this.dom = dom;
        this.attrs.forEach(attr => {
            AttachEventListener(<HTMLElement>dom, attr.name, attr.value);
        });
    }
    ClearChildren() {
        this.children = [];
    }
    Dirty() {
        if (this.type == "custom") {
            this.instance.$Dirty();
        } else {
            this.children.forEach(child => {
                child.Dirty();
            });
        }
    }
}