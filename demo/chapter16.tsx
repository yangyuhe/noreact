import { MVVM, React } from "../src";

export class Chapter16 extends MVVM {
    protected $Render() {
        return <div>
            这里演示函数组件
            <Avater name="Tom" img="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586022746674&di=ee35e4ce9e90a7900a66e1a00af9e484&imgtype=0&src=http%3A%2F%2Fcnpic.crntt.com%2Fupload%2F201601%2F25%2F104099225.jpg"></Avater>
        </div>
    }
}
function Avater(props: { name: string, img: string }) {
    return <div style={{ border: "1px solid black", padding: "10px", width: "100px" }}>
        <img style={{ width: "100%", height: "auto" }} src={props.img} />
        {props.name}
    </div>
}