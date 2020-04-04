import { MVVM, React, Fragment } from "../src";

class UserState {
    islogin = false;
    username: string = "";
    login() {
        this.islogin = true;
        this.username = "Tom"
    }
    logout() {
        this.islogin = false;
        this.username = "";
    }
}
let state = new UserState();
class Tab1 extends MVVM {
    state: UserState = state;
    $Render() {
        return <Fragment>
            <h1>Person Card</h1>
            <div>登录状态:{this.state.islogin ? '已登录:' + this.state.username : '未登录'}</div>
        </Fragment>
    }
}
class Tab2 extends MVVM {
    state: UserState = state;
    $Render() {
        return <button onClick={this.click.bind(this)}>{this.state.islogin ? '退出' : '登录'}</button>
    }
    click() {
        if (this.state.islogin)
            this.state.logout();
        else
            this.state.login();
    }
}

export class NoRedux extends MVVM {
    curTab = 'tab1';
    $Render() {
        return <div className="tabs-container">
            <div className="tabs">
                <button onClick={this.tab.bind(this, 'tab1')} className="tab">tab1</button>
                <button onClick={this.tab.bind(this, 'tab2')} className="personcard">tab2</button>
            </div>
            {this.curTab == 'tab1' ? <Tab1 /> : null}
            {this.curTab == 'tab2' ? <Tab2 /> : null}
        </div>
    }
    tab(name: string) {
        this.curTab = name;
    }
}