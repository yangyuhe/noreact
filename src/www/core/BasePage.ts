import { BaseComponent } from "./BaseComponent";
import config from "../../app.json";
export abstract class BasePage<T> extends BaseComponent<T>{
    ToHtml(){
        let vnode=this.GetVNode();
        try{
            let data=JSON.stringify(this.params);
            vnode.AddChild(`<script>
                var $noreact_roots=[{name:${this._name},data:${data}}];
            </script>`);
            vnode.AddChild(`<script src="http://${config.webpack_host}:${config.webpack_port}/bootstrap.js"></script>`);

            return vnode.ToHtml();
        }catch(err){
            console.error("json stringify出错:"+this.constructor.name);
            return "json stringify出错:"+this.constructor.name;
        }
    }
}