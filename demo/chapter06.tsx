import { MVVM, React } from "../src";

export class Chapter06 extends MVVM {
    show = true;
    constructor() {
        super();
        setTimeout(() => {
            this.show = false;
        }, 3000);
    }
    protected $Render() {
        return <div>
            这里向你展示NoReact中的最基本的两个生命周期的使用.<br />
            $didMounted函数和构造函数中都可以进行初始化操作，但二者仍有区别：
            1.$didMounted方法中可以访问到dom。
            2.如果你保留了对某个组件的引用，当你的组件从虚拟树中移除时$willUnMount方法会被调用，当组件再次被加入到虚拟树中时$didMounted会被再次调用。
            <br />
            记得在$willUnMount中销毁申请的资源
            {this.show ? <Timmer></Timmer> : null}
        </div>
    }
}

class Timmer extends MVVM {
    time = new Date();
    timmer = null;
    constructor() {
        super();
    }
    $didMounted() {
        this.timmer = setInterval(() => {
            this.time = new Date();
        }, 1000);
    }
    $willUnMount() {
        window.clearInterval(this.timmer);
    }
    protected $Render() {
        return <div>
            {this.time.toLocaleTimeString()}
        </div>
    }

}