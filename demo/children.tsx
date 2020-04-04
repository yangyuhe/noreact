import { React, MVVM, VNode, Fragment, Ref } from "../src";
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
export class Children extends MVVM {
    menus = ["home", "about us"];
    protected $Render(): VNode {
        return <div className="app">
            <Header>
                {this.menus.map(menu => <div>{menu}</div>)}
            </Header>
            <Body>
                <button onClick={() => { this.addmenu() }}>add menu</button>
            </Body>
        </div>
    }
    addmenu() {
        this.menus.push("demo");
    }
}