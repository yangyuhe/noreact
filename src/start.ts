import { HomePage } from "./www/pages/HomeV1";
import http from "http";
import path from "path";
import fs from "fs";
import React from "./www/core/react";
import {GetStyles, WatchScss} from "./traverse-scss";
import WebSocket from "ws";


let server=http.createServer((req,res)=>{
    if(req.url.startsWith("/static/")){
        let asset=path.resolve(__dirname,"../bundle", req.url.slice("/static/".length));
        fs.access(asset,err=>{
            if(!err){
                fs.createReadStream(asset).pipe(res);
            }else{
                res.statusCode=404;
                res.end()
            }
        });
        return;
    }
    if(req.url.startsWith("/homepage")){
        React.ResetCounter();
        let page=new HomePage({listings:[{name:"汤逊湖一号",price:200,opentime:new Date('2018-3-2')},
        {name:"汤逊湖二号",price:100,opentime:new Date('2017-6-2')}]});
        let tree=page.GetVNode();

        let head=tree.GetChild("head");
        let styles=tree.GetStyleEntries();
        let entries=GetStyles(styles);
        if(head){
            entries.forEach(entry=>{
                head.AddChild(`<style id="${entry.name}">${entry.css}</style>`);
            });
        }
        let html=tree.ToHtml();
        
        res.setHeader("Content-Type","text/html");
        res.write(html,"utf8");
        res.end();
        return;
    }
    res.statusCode=404;
    res.end();
    
});
server.listen(8001);

let wsServer=new WebSocket.Server({port:8002});
wsServer.on("connection",(ws)=>{
    WatchScss(data=>{
        ws.send(JSON.stringify(data));
    });
});

