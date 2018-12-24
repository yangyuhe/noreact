import { HomePage } from "./www/pages/HomeV1";
import http from "http";
import path from "path";
import fs, { exists } from "fs";
import React from "./www/core/react";


let server=http.createServer((req,res)=>{
    
    if(req.url=="/homepage"){
        React.ResetCounter();
        let page=new HomePage({listings:[{name:"汤逊湖一号",price:200,opentime:new Date('2018-3-2')},
        {name:"汤逊湖二号",price:100,opentime:new Date('2017-6-2')}]});
        
        let html=page.ToHtml();
        
        res.setHeader("Content-Type","text/html");
        res.write(html,"utf8");
        res.end();
        return;
    }else{
        let url="http://127.0.0.1:8003"+req.url;
        let client=http.request(url,im=>{
            im.pipe(res);
        });
        client.end();
    }
    
});
server.listen(8001,()=>{
    console.log("nodejs server listening at http://localhost:8001");
    process.send && process.send("start_over")
});


