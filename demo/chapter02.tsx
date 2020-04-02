import { MVVM, React } from "../src";

export class Chapter02 extends MVVM {
    text = "这里构建一个稍微复杂的虚拟节点,你可以使用任意的jsx语法构建界面,注意我们虽然没有直接用到React变量，但是你需要导入它"
    protected $Render() {
        return <h2>{this.text}</h2>
    }
}