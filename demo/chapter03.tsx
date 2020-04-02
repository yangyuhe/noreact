import { MVVM, React } from "../src";

export class Chapter03 extends MVVM {
    time = new Date();
    constructor() {
        super();
        setInterval(() => {
            this.time = new Date();
        }, 1000);
    }
    protected $Render() {
        return <div>
            <div>这里演示你只需要更新变量即可更新对应的dom,没错,time就是react里面的一个state</div>
            {this.time.toLocaleTimeString()}
        </div>
    }

}