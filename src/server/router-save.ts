import fs from "fs";
import path from "path";
import { Middleware } from "./core/linked";

export let Save:Middleware=function(req,resp){
    req.setEncoding("utf8");
    let body="";
    req.on("data",data=>{
        body+=data;
    });
    req.on("end",()=>{
        try{
            let postobj=JSON.parse(body);
            if(postobj.name && postobj.data){
                let res=WriteFile(postobj.name,postobj.data,path.resolve(process.cwd(),"sample"));
                if(res){
                    resp.json({
                        status:"ok"
                    });
                }else{
                    resp.json({
                        status:"fail",
                        message:"保存失败"
                    });
                }
            }else{
                resp.json({
                    message:"提交数据缺少name或者data"
                });
            }
        }catch(err){
            resp.json({
                stack:err.stack,
                message:err.message
            });
        }
    });
};
function WriteFile(name:string,data:any,dir:string):boolean{
    let files=fs.readdirSync(dir);
    for(let i=0;i<files.length;i++){
        let filepath=path.resolve(dir,files[i]);
        let stat=fs.statSync(filepath);
        if(stat.isDirectory()){
            let success=WriteFile(name,data,filepath);
            if(success)
                return true;
        }else{
            if(stat.isFile() && (name+".json")==files[i]){
                let olddata=fs.readFileSync(filepath,{encoding:"utf8"});
                let oldobj=JSON.parse(olddata);
                if(!oldobj){
                    throw new Error("数据文件错误[${name}.json]")
                }
                if(oldobj.name!=name){
                    throw new Error(`模块名不匹配[${oldobj.name}]-[${name}]`);
                }
                oldobj.data=data;
                fs.writeFileSync(filepath,JSON.stringify(oldobj));
                return true;
            }
        }
    }
    return false;
}