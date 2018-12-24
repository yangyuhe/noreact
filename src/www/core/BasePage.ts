import { BaseComponent } from "./BaseComponent";

export abstract class BasePage<T> extends BaseComponent<T>{
    ToHtml(){
        let vnode=this.GetVNode();
        try{
            let data=JSON.stringify(this.params);
            vnode.AddChild(`<script>
                let $noreact_data=${data};
                let $noreact_root="${this.constructor.name}";
            </script>`);
            vnode.AddChild(`<script src="http://localhost:8003/bootstrap.js"></script>`);

            return vnode.ToHtml();
        }catch(err){
            console.error("json stringify出错:"+this.constructor.name);
            return "json stringify出错:"+this.constructor.name;
        }
    }
}