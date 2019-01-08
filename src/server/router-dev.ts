import fs from "fs";
import http from "http";
import path from "path";
import config from "../app.json";
import { Linked } from "./core/linked";

export let devLinked=new Linked();


devLinked.Get("/custom",(req,res)=>{
    let moduledata:{name:string,data:any}[]=[];
    let dir=path.resolve(process.cwd(),"sample");
    let modules=req.query["module"];
    if(modules==null){
        res.json({
            message:"未指定模块"
        });
        return;
    }
    if(typeof(modules)=="string"){
        modules=[modules];
    }
    for(let i=0;i<modules.length;i++){
        let module=modules[i];
        try{
            let json=getJSON(module,dir);
            if(!json || !json.name){
                throw new Error(`未找到数据文件${module}.json`);
            }
            if(json.data==null)
                json.data={};
            moduledata.push(json);
        }catch(err){
            res.json({
                stack:err.stack,
                message:err.message
            });
            return;
        }
    }
    let url=`http://${config.node_host}:${config.node_port}/custom`;
    let client=http.request({host:config.node_host,port:config.node_port,path:"/custom",method:"POST"},im=>{
        let rawheaders=im.rawHeaders;
        let headers:{[name:string]:string|string[]}={};
        for(let i=0;i<rawheaders.length;i+=2){
            let name=rawheaders[i];
            let value=rawheaders[i+1];
            let old=headers[name];
            if(old==null)
                headers[name]=value;
            else{
                if(typeof(old)=="string"){
                    headers[name]=[old,value];
                }else{
                    old.push(value);
                }
            }
        }
        for(let name in headers){
            res.setHeader(name,headers[name]);
        }
        im.pipe(res);
    });
    client.write(JSON.stringify(moduledata));
    client.end();
});
devLinked.OtherWise=(req,res)=>{
    let url=`http://${config.webpack_host}:${config.webpack_port}`+req.url;
    let client=http.request({
        host:config.webpack_host,
        port:config.webpack_port,
        path:req.url
    },im=>{
        im.pipe(res);
    });
    client.on("error",err=>{
        res.json({
            stack:err.stack,
            message:err.message
        });
    });
    client.end();
};
/**
 * 获得指定的模块名数据文件的内容
 * @param name 
 * @param dir 
 */
function getJSON(name:string,dir:string):any{
    let files=fs.readdirSync(dir);
    for(let i=0;i<files.length;i++){
        let file=files[i];
        let stat=fs.statSync(path.resolve(dir,file));
        if(stat.isFile() && file==(name+".json")){
            let fullpath=path.resolve(dir,file);
            let json=fs.readFileSync(fullpath,{encoding:"utf8"});
            return JSON.parse(json);
        }
        if(stat.isDirectory()){
            let json=getJSON(name,path.resolve(dir,file));
            if(json){
                return json;
            }
        }
    }
    return null;
}