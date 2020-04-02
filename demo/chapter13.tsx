import { MVVM, Fragment, React } from "../src";

export class Chapter13 extends MVVM {
    protected $Render() {
        return <div>
            这里演示如何使用fragment,这功能跟vue里的template和react里的fragment是一样的
            <Fragment>
                <div>1</div>
                <div>2</div>
            </Fragment>
        </div>
    }
}