import { MVVM } from "../src"
export class Hello extends MVVM {
    text = `这是最简单的开始,构建NoReact程序你只需要构建一个javascript类然后继承MVVM并实现$Render方法即可。你可以简单返回一个基础类型数据或者更复杂的虚拟节点(VNode)`
    protected $Render(): any {
        return this.text;
    }
}