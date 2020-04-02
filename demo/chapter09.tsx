import { MVVM, React } from "../src";

export class Chapter09 extends MVVM {
    user = {
        name: '',
        gender: 'female',
        classlevel: '2',
        iscity: true
    }
    protected $Render() {
        return <div>
            这里展示如何使用表单
            <form onSubmit={(event) => this.submit(event)}>
                <label>
                    名字
                    <input type="text" value={this.user.name} onChange={(event) => this.onChange(event, 'name')} />
                </label>
                <br />
                <label>
                    性别
                    <input checked={this.user.gender == 'male'} type="radio" value='male' onChange={event => this.onChange(event, 'gender')} />男
                    <input checked={this.user.gender == 'female'} type="radio" value='female' onChange={event => this.onChange(event, 'gender')} />女
                </label>
                <br />
                <label>
                    年级
                    <select value={this.user.classlevel} onChange={event => this.onChange(event, 'classlevel')}>
                        <option value="1">一年级</option>
                        <option value="2">二年级</option>
                        <option value="3">三年级</option>
                    </select>
                </label>
                <br />
                <label>
                    城市户口
                    <input type="checkbox" value="city" checked={this.user.iscity} onChange={event => this.onChange(event, 'iscity')} />
                </label>
                <br />
                <input type="submit" value="提交" />
            </form>
        </div>
    }
    onChange(event, prop: string) {
        if (prop != 'iscity')
            this.user[prop] = event.target.value;
        else {
            this.user.iscity = event.target.checked;
        }
    }
    submit(event) {
        event.preventDefault();
        alert(JSON.stringify(this.user));
    }

}