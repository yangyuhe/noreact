import { Middleware } from "./linked";
declare module "http"{
    interface ServerResponse{
        json(obj:any):void;
    }
}

const JSONMiddleware:Middleware=function(req,resp,next){
    resp.json=function(obj:any){
        this.setHeader('Content-Type', 'application/json');
        this.end(JSON.stringify(obj));
    };
    next();
};
export default JSONMiddleware;