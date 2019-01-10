import { Middleware } from "./linked";
import url from "url";

const Print:Middleware=(req,resp,next)=>{
    next();
    let content=req.method+" "+resp.statusCode+" "+(resp.statusMessage?resp.statusMessage:"")+" "+(new Date()).toLocaleString()+" "+req.url;
    if(resp.statusCode<300){
        Log(content,"green");
        return;
    }
    if(resp.statusCode<400){
        Log(content,"green");
        return;
    }
    if(resp.statusCode>=400){
        Log(content,"red");
        return;
    }
};
export function Log(str:string,color:"green"|"red"="green"){
    if(str!=""){
        if(color=="red")
            console.log("\x1b[31m"+str+"\n");
        if(color=="green")
            console.log("\x1b[32m"+str+"\n");
    }
}
export default Print;