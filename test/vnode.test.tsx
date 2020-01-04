import { React, MVVM } from "../src"
declare global {
    namespace JSX {
        interface IntrinsicAttributes {
            ref?: any;
            key?: any;
        }
    }
}
class Test extends MVVM<void>{
    list = [{ name: "a" }, { name: 'b' }];
    Render() {
        return <ul className="container">
            {this.list.map(item => <li key={item.name} class={item.name}>{item.name}</li>)}
        </ul>
    }
    change() {
        this.list = [{ name: "b" }, { name: 'a' }]
    }
    add() {
        this.list.push({ name: "c" });
    }
}
class Item extends MVVM<{}>{
    Render() {
        return <li></li>;
    }
}
class List extends MVVM<void>{
    list = [1, 2];
    counter = 3;
    Render() {
        return <div>
            {this.list.map(item => <Item key={item}></Item>)}
        </div>
    }
    change() {
        this.list = [2, 1];
    }
    add() {
        this.list.push(this.counter++);
    }
}
describe('测试vnode', () => {
    test("重排节点", (done) => {
        let t = new Test();
        t.$DoRender();
        let children = t.$GetRoot().GetChildren().slice(0);
        t.change();
        Promise.resolve().then(() => {
            let newchildren = t.$GetRoot().GetChildren().slice(0);
            expect(children[0]).toBe(newchildren[1]);
            expect(children[1]).toBe(newchildren[0]);
            done();
        });
    });
    test("重排节点 组件", (done) => {
        let t = new List();
        t.$DoRender();
        let children = t.$GetRoot().GetChildren().slice(0);
        t.change();
        Promise.resolve().then(() => {
            let newchildren = t.$GetRoot().GetChildren().slice(0);
            expect(children[0]).toBe(newchildren[1]);
            expect(children[1]).toBe(newchildren[0]);
            done();
        });
    });
    test("重排节点 组件 dom", (done) => {
        let t = new List();
        t.$ToDom();
        let children = Array.prototype.slice.call((t.$GetRoot().GetDom()[0] as HTMLElement).children, 0);
        t.change();
        Promise.resolve().then(() => {
            let newchildren = Array.prototype.slice.call((t.$GetRoot().GetDom()[0] as HTMLElement).children, 0);
            expect(children[0]).toBe(newchildren[1]);
            expect(children[1]).toBe(newchildren[0]);
            done();
        });
    });
    test("新增节点", done => {
        let t = new Test();
        t.$DoRender();
        let children = t.$GetRoot().GetChildren().slice(0);
        t.add();
        Promise.resolve().then(() => {
            let newchildren = t.$GetRoot().GetChildren().slice(0);
            expect(children[0]).toBe(newchildren[0]);
            expect(children[1]).toBe(newchildren[1]);
            expect(newchildren.length).toBe(3);
            expect(newchildren[2].GetAttr('class')).toBe("c");
            done();
        });
    });
    test("新增节点 组件", done => {
        let t = new List();
        t.$DoRender();
        let children = t.$GetRoot().GetChildren().slice(0);
        t.add();
        Promise.resolve().then(() => {
            let newchildren = t.$GetRoot().GetChildren().slice(0);
            expect(children[0]).toBe(newchildren[0]);
            expect(children[1]).toBe(newchildren[1]);
            expect(newchildren.length).toBe(3);
            expect(newchildren[2].GetAttr('key')).toBe(3);
            done();
        });
    });
    test("新增节点 dom", done => {
        let t = new Test();
        let dom = t.$ToDom()[0] as HTMLElement;
        let children = Array.prototype.slice.call(dom.children, 0);
        t.add();
        Promise.resolve().then(() => {
            let newchildren = Array.prototype.slice.call((t.$GetRoot().GetDom()[0] as HTMLElement).children, 0);
            expect(children[0]).toBe(newchildren[0]);
            expect(children[1]).toBe(newchildren[1]);
            expect(newchildren.length).toBe(3);
            expect(newchildren[2].getAttribute('class')).toBe('c');
            done();
        });
    });
})
