import { MVVM, React, Fragment } from "../src"
import { Hello } from "./chapter01";
import { Chapter02 } from "./chapter02";
import { Chapter03 } from "./chapter03";
import { Chapter04 } from "./chapter04"
import { Chapter05 } from "./chapter05";
import { Chapter06 } from "./chapter06";
import { Chapter07 } from "./chapter07";
import { Chapter08 } from "./chapter08";
import { Chapter09 } from "./chapter09";
import { Chapter10 } from "./chapter10";
import { Chapter11 } from "./chapter11";
import { Chapter12 } from "./chapter12";
import { Chapter13 } from "./chapter13";
import { Chapter14 } from "./chapter14";
import { Chapter15 } from "./chapter15";
import { Chapter16 } from "./chapter16";
import { TodoList } from "./todo";
import { Game } from "./game";
import { NoRedux } from "./noredux";
import { Children } from "./children";
import { HOC } from "./hoc";
export class App extends MVVM {
    protected $Render(): any {
        let chapters = [<Hello />, <Chapter02 />, <Chapter03 />, <Chapter04 />, <Chapter05 />,
        <Chapter06 />, <Chapter07 />, <Chapter08 />, <Chapter09 />, <Chapter10 />, <Chapter11 />,
        <Chapter12 />, <Chapter13 />, <Chapter14 />, <Chapter15 />, <Chapter16 />];
        let others = [{ title: '一个粗糙的todo示例', content: <TodoList /> },
        { title: '一个简单的game', content: <Game /> },
        { title: '一个简单的例子演示不使用redux也可以实现数据的共享和响应式', content: <NoRedux /> },
        { title: '演示children的使用', content: <Children /> },
        { title: "演示高阶组件", content: <HOC /> }];
        return <Fragment>
            {chapters.map((item, index) => {
                return [<h2>第{index + 1}章</h2>, item, <hr />];
            })}
            {others.map(item => {
                return <Fragment>
                    <h2>{item.title}</h2>
                    {item.content}
                </Fragment>
            })}
        </Fragment>
    }
}
let app = new App();
app.$AppendTo("body");