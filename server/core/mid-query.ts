import { Middleware } from "./linked";
import url from "url";
declare module "http"{
    interface IncomingMessage{
        query:{[name:string]:string|string[]}
    }
}
const Query:Middleware=(req,resp,next)=>{
    let res=url.parse(req.url,true);
    req.query=res.query;
    next();
};
export default Query;