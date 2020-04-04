import { MVVM, React } from "../src";

export class Chapter15 extends MVVM {
    protected $Render() {
        return <div>
            这里演示事件系统，框架内置了一个简单的事件监听机制，当有跨组件的交互需求时可能会用的着
            <Outer>
                <Middle>
                    <Inner></Inner>
                </Middle>
            </Outer>
        </div>
    }

}
class Outer extends MVVM {
    $didMounted() {
        this.$on("outer", () => {
            alert("outer")
        })
    }
    protected $Render() {
        return <div style={{ border: '1px solid black', padding: "10px" }}>
            outer
            {this.$children}
        </div>
    }

}
class Middle extends MVVM {
    $didMounted() {
        this.$on("middle", () => {
            alert("middle")
        })
    }
    protected $Render() {
        return <div style={{ border: '1px solid black', padding: "10px" }}>
            Middle
            <button onClick={this.outer.bind(this)}>outer</button>
            <button onClick={this.inner.bind(this)}>inner</button>
            <button onClick={this.broadcast.bind(this)}>broadcast</button>
            {this.$children}
        </div>
    }
    outer() {
        this.$emitUp("outer")
    }
    inner() {
        this.$emitDown("inner")
    }
    broadcast() {
        this.$broadcast("outer")
        this.$broadcast("inner")
    }

}
class Inner extends MVVM {
    $didMounted() {
        this.$on("inner", () => {
            alert("inner")
        })
    }
    protected $Render() {
        return <div style={{ border: '1px solid black', padding: "10px" }}>
            Inner
        </div>
    }

}