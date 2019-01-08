import http from "http";
import { devLinked } from "./server/router-dev";
import { Linked, DefaultLinked } from "./server/core/linked";
import { proLinked } from "./server/router-prod";
import React from "./www/core/react";
import config from "./app.json";


let linked=DefaultLinked();
linked.Use((req,res,next)=>{
    React.ResetCounter();
    next();
});
linked.Use(proLinked);
linked.Use(devLinked);


let server=http.createServer((req,res)=>{
    console.log(123)
    linked.Startup(req,res);
});


server.listen(config.node_port,config.node_host,()=>{
    console.log("nodejs start listening at http://"+config.node_host+":"+config.node_port);
});


