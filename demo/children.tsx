import { MVVM, VNode, React } from "../src";
import { Game } from "./game";
import { Tabs } from "./noredux";
import { TodoList } from "./todo";
class Header extends MVVM<{}>{
    protected $Render() {
        return <React.Fragment>
            {this.$children}
        </React.Fragment>
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
    protected $Render(): VNode {
        return <div className="app">
            <Header>
                {this.menus.map(menu => <div>{menu}</div>)}
            </Header>
            <Body>
                <TodoList></TodoList>
                <Game></Game>
                <Tabs></Tabs>
                <button onClick={() => { this.addmenu() }}>add menu</button>
            </Body>
        </div>
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