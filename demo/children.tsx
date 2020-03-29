import { React, MVVM, VNode, Fragment, Ref } from "../src";
import { Game } from "./game";
import { Tabs } from "./noredux";
import { TodoList } from "./todo";
class Header extends MVVM {
    protected $Render() {
        return <Fragment>
            {this.$children}
        </Fragment>
    }
}
class Body extends MVVM {
    protected $Render(): VNode {
        return <div className="body">
            {this.$children}
        </div>
    }
}
class App extends MVVM {
    menus = ["home", "about us"];
    usernameRef: Ref;
    todolistRef: Ref;
    constructor() {
        super();
        this.usernameRef = new Ref();
        this.todolistRef = new Ref();
    }
    protected $Render(): VNode {
        return <div className="app">
            <Header>
                {this.menus.map(menu => <div>{menu}</div>)}
                <span ref={this.usernameRef}>user name</span>
            </Header>
            <Body>
                <button onClick={() => { this.addmenu() }}>add menu</button>
                <hr />
                <TodoList ref={this.todolistRef}></TodoList>
                <hr />
                <Game></Game>
                <hr />
                <Tabs></Tabs>

                <hr />
                <TestUndestroyed></TestUndestroyed>
            </Body>
        </div>
    }
    $didMounted() {
        console.log(this.usernameRef.current);
        console.log(this.todolistRef.current);
    }
    addmenu() {
        this.menus.push("demo");
    }
}
document.addEventListener("DOMContentLoaded", () => {
    let app = new App();
    (window as any).noreact = app;
    app.$AppendTo(document.body);
})

class TestUndestroyed extends MVVM {
    private show = true;
    private timer = <Timer></Timer>
    protected $Render(): VNode {
        return <Fragment>
            {this.show ? this.timer : null}
            <button onClick={() => { this.toggle() }}>toggle</button>
        </Fragment>
    }
    toggle() {
        this.show = !this.show;
    }
}
class Timer extends MVVM {
    private timmer;
    private counter = 0;
    $didMounted() {
        if (!this.timmer) {
            this.timmer = setInterval(() => {
                this.counter++;
            }, 1000)
        }
    }
    $willUnMount() {
        // clearInterval(this.timmer);
    }
    protected $Render(): VNode {
        return <h1>{this.counter}</h1>
    }

}