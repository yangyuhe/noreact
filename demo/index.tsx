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
export class App extends MVVM {
    protected $Render(): any {
        let chapters = [<Hello />, <Chapter02 />, <Chapter03 />, <Chapter04 />, <Chapter05 />,
        <Chapter06 />, <Chapter07 />, <Chapter08 />, <Chapter09 />, <Chapter10 />, <Chapter11 />];
        return <Fragment>
            {chapters.map((item, index) => {
                return [<h2>第{index + 1}章</h2>, item, <hr />];
            })}
        </Fragment>
    }
}
let app = new App();
app.$AppendTo("body");