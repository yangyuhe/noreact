import {IncomingMessage,ServerResponse, METHODS} from "http";
import JSONMiddleware from "./mid-json";
import HTMLMiddleware from "./mid-html";
import url from "url";
import Query from "./mid-query";
import Print from "./mid-print";
class Procedure{
    private path:string;
    private fully:boolean;
    private method:HttpMethod;
    private handler:Middleware|Linked;
    private next:Procedure;
    private attachedLinked:Linked;
    constructor(path:string,method:HttpMethod,middleware:Middleware|Linked,fully:boolean,attachedLinked:Linked){
        this.path=path;
        this.method=method;
        this.handler=middleware;
        this.fully=fully;
        this.attachedLinked=attachedLinked;
    }
    Do(req:IncomingMessage,res:ServerResponse){
        if(this.match(req,res)){
            if(this.handler instanceof Linked){
                this.handler.Startup(req,res);
            }else{
                this.handler(req,res,()=>{
                    this.next.Do(req,res);
                });
            }
        }else{
            if(this.next)
                this.next.Do(req,res);
            else
                this.attachedLinked.OtherWise(req,res);
        }
    }
    SetNext(procedure:Procedure){
        if(this.handler instanceof Linked){
            this.handler.$SetOtherwise(procedure);
            this.next=procedure;
        }else
            this.next=procedure;
    }
    private match(req:IncomingMessage,res:ServerResponse){
        let absolutePath=this.$GetContextPath();
        let pathname=this.attachedLinked.$GetReqPathname();
        if(this.method!=req.method && this.method!="ALL")
            return false;
        
        
        if(!this.fully && pathname.startsWith(absolutePath)){
            return true;
        }
        if(this.fully && pathname==absolutePath){
            return true;
        }
        return false;
    }
    
    $GetContextPath():string{
        if(this.path.startsWith("/"))
            return this.path;
        let contextPath=this.attachedLinked.$GetContextPath();
        if(contextPath.endsWith("/"))
            return contextPath+this.path;
        else
            return contextPath+"/"+this.path;
    }
}
export class Linked{
    private firstHandler:Procedure;
    private lastHandler:Procedure;
    private attachedProcedure:Procedure;
    private pathname:string;
    private otherwise:Procedure;
    
    Startup(req:IncomingMessage,res:ServerResponse){
        if(!this.firstHandler){
            this.OtherWise(req,res);
            return;
        }
        this.pathname=url.parse(req.url).pathname;
        this.firstHandler.Do(req,res);
    }
    private $mount(path:string,method:HttpMethod,handler:Middleware|Linked,fully:boolean=false){
        let procedure=new Procedure(path,method,handler,fully,this);
        if(handler instanceof Linked){
            handler.$SetAttachedProcedure(procedure);
        }
        if(!this.firstHandler){
            this.firstHandler=procedure;
            this.lastHandler=procedure;
        }else{
            this.lastHandler.SetNext(procedure);
            this.lastHandler=procedure;
        }
        return this;
    }
    
    Use(middleware:Middleware|Linked,fully?:boolean):Linked;
    Use(path:string,middleware:Middleware|Linked,fully?:boolean):Linked;
    Use(path:string,method:HttpMethod,handler:Middleware|Linked,fully?:boolean):Linked;
    Use(){
        let first=arguments[0];
        let second=arguments[1];
        let third=arguments[2];
        let fourth=arguments[3];
        
        if((typeof(first)=="function"||first instanceof Linked)){
            second=!!second;
            this.$mount("","ALL",first,second);
        }
        if(typeof(first)=="string" && (typeof(second)=="function"||second instanceof Linked)){
            third=!!third;
            this.$mount(first,"ALL",second,third);
        }
        if(typeof(first)=="string" && typeof(second)=="string" && (typeof(third)=="function"||third instanceof Linked)){
            if(HttpMethods.indexOf(second)==-1){
                throw new Error("unsuported method:"+second);
            }
            fourth=!!fourth;
            this.$mount(first,<HttpMethod>second,third,fourth);
        }
        return this;
    }
    
    Get(path:string,middleware:Middleware|Linked,fully:boolean=false){
        this.$mount(path,"GET",middleware,fully);
        return this;
    }
    Post(path:string,middleware:Middleware|Linked,fully:boolean=false){
        this.$mount(path,"POST",middleware,fully);
        return this;
    }
    Put(path:string,middleware:Middleware|Linked,fully:boolean=false){
        this.$mount(path,"PUT",middleware,fully);
        return this;
    }
    Delete(path:string,middleware:Middleware|Linked,fully:boolean=false){
        this.$mount(path,"DELETE",middleware,fully);
        return this;
    }
    $GetLastHandler(){
        return this.lastHandler;
    }
    
    $SetAttachedProcedure(procedure:Procedure){
        this.attachedProcedure=procedure;
    }
    $GetContextPath():string{
        if(!this.attachedProcedure)
            return "";
        return this.attachedProcedure.$GetContextPath();
    }
    $GetReqPathname(){
        return this.pathname;
    }
    OtherWise(req:IncomingMessage,res:ServerResponse){
        if(this.otherwise)
            this.otherwise.Do(req,res);
        else{
            res.statusCode=404;
            res.write(req.url+" not found");
            res.end();
        }
    }

    $SetOtherwise(procedure:Procedure){
        this.otherwise=procedure;
    }
}

export type HttpMethod="GET"|"HEAD"|"POST"|"PUT"|"DELETE"|"CONNECT"|"OPTIONS"|"TRACE"|"ALL";
const HttpMethods=["GET","HEAD","POST","PUT","DELETE","CONNECT","OPTIONS","TRACE","ALL"];
export type Middleware=(req:IncomingMessage,res:ServerResponse,next?:()=>void)=>void;

export function DefaultLinked(){
    let linked=new Linked();
    linked.Use(Print);
    linked.Use(JSONMiddleware);
    linked.Use(HTMLMiddleware);
    linked.Use(Query);
    return linked;
}



