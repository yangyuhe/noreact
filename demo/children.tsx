import { React, MVVM, VNode, Fragment, Ref } from "../src";
import { Game } from "./game";
import { Tabs } from "./noredux";
import { TodoList } from "./todo";
class Header extends MVVM<{}>{
    protected $Render() {
        return <Fragment>
            {this.$children}
        </Fragment>
    }
}
class Body extends MVVM<{}>{
    protected $Render(): VNode {
        return <div className="body">
            {this.$children}
        </div>
    }
}
class App extends MVVM<void>{
    menus = ["home", "about us"];
    usernameRef: Ref;
    todolistRef: Ref;
    $onInit() {
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
                <TodoList ref={this.todolistRef}></TodoList>
                <Game></Game>
                <Tabs></Tabs>
                <button onClick={() => { this.addmenu() }}>add menu</button>
            </Body>
        </div>
    }
    $onRendered() {
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