import { MVVM, React } from "../src";

export class Chapter14 extends MVVM {
    $didMounted() {
        let style = document.createElement("style");
        style.setAttribute("type", "text/css");
        style.innerHTML = `.yellow{color:yellow}`;
        document.body.appendChild(style);
    }
    protected $Render() {
        return <div>
            使用样式,以下方式都可以
            <br />
            <span style="color:red">hello</span>
            <span style={{ color: 'red' }}>hello</span>
            <span class="yellow">hello</span>
            <span className="yellow">hello</span>
            <span className={['yellow']}>hello</span>
        </div>
    }

}