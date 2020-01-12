import { VNode, React } from "../src";
import { Simple } from "./mvvms";

describe('VNode', () => {
    test('VNode GetTag', () => {
        let foo: VNode = <div>foo</div>;
        expect(foo.GetTag()).toBe("div");
    });
    test('VNode GetType', () => {
        let foo: VNode = <div>foo</div>;
        expect(foo.GetType()).toBe("standard");
        expect(foo.GetChildren()[0].GetType()).toBe("text");
        let bar: VNode = <Simple></Simple>;
        expect(bar.GetType()).toBe("custom");
    });
    test('VNode GetText', () => {
        let foo: VNode = <div>foo</div>;
        expect(foo.GetChildren()[0].GetText()).toBe("foo");
    });
    test('VNode GetInstance', () => {
        let bar: VNode = <Simple></Simple>;
        expect(bar.GetInstance()).toBeInstanceOf(Simple);
    });
    test('VNode GetParent', () => {
        let bar: VNode = <Simple></Simple>;
        let foo: VNode = <div>{bar}</div>
        expect(bar.GetParent()).toBe(foo);
    });
    test('VNode GetChildren', () => {
        let foo: VNode = <div>
            bar
            foo
        </div>;
        expect(foo.GetChildren().length).toBe(1);
    });
    test('VNode ToHtml', () => {
        let foo: VNode = <div>
            <Simple></Simple>
        </div>;
        expect(foo.ToHtml()).toBe('<div><h1>this is simple</h1></div>');
    });

    test('VNode ToDom', () => {
        let foo: VNode = <div>
            <Simple></Simple>
        </div>;
        let dom = foo.ToDom() as HTMLElement[];
        expect(dom.length).toBe(1);
        expect(dom[0].tagName).toBe("DIV");
        expect(dom[0].children.length).toBe(1);
        expect(dom[0].children[0].tagName).toBe("H1");
    });

    test('VNode Rendered', () => {
        let fn = jest.fn();
        let simple = new Simple({
            rendered: function () {
                fn('rendered');
            }
        });
        let dom = simple.$ToDom();
        simple.$Rendered();
    });

    test('VNode trigger event', () => {
        let simple = new Simple({});
        let fn = jest.fn((args) => { });
        simple.changeName = function () {
            fn("click");
        };
        let doms = simple.$ToDom();
        (doms[0] as HTMLElement).click();
        expect(fn.mock.calls.length).toBe(1);
        expect(fn.mock.calls[0][0]).toBe('click');
    });

});

