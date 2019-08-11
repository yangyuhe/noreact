import { ComponentFactory } from "../www/core/component-manager";
import { Linked } from "./core/linked";
import "../www/components/house-card/house-card"

export let proLinked=new Linked();
proLinked.Post("/custom",(req,res)=>{
    let data="";
    req.setEncoding("utf8");
    req.on("data",chunk=>{
        data+=chunk;
    });
    req.on("end",()=>{
        try{
            let modules:{name:string,data:any}[]=JSON.parse(data);
            let html=`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <title>Document</title>
            </head>
            <body>
            `;
            for(let i=0;i<modules.length;i++){
                let module=modules[i];
                if(!module.name){
                    res.end("module name empty:");
                    return;
                }
                if(!module.data){
                    res.end("module data empty:");
                    return;
                }
                let instance=ComponentFactory(module.name,module.data);
                if(instance){
                    let str=instance.$ToHtml();
                    html+=str;
                }else{
                    throw new Error(`[${module.name}]模块找不到`);
                }
            }
            html+=`\n<script>
                var $noreact_roots=${data};
            </script>
            <script src="http://localhost:8004/bootstrap.js"></script>
            </body>
            </html>`;
            res.html(html);
        }catch(err){
            res.json({message:err.message,stack:err.stack});
            
        }
    });
});
