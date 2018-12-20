import fs from "fs";
import path from "path";
import sass from "node-sass";

interface ScssEntry{
    name:string,
    css:string,
    filepath:string,
    dependencies:string[]
}
class ScssManager{
    //缓存scss内容
    cache:ScssEntry[]=[];
    /**
     *新增scss
    */
    AddScss(entry:ScssEntry):boolean{
        let existEntry=this.cache.find(value=>value.name==entry.name);
        if(existEntry){
            console.error("样式文件重复:"+existEntry.filepath+","+entry.filepath);
            return false;
        }
        this.cache.push(entry);
        return true;
    }
    /**
     * 删除scss
     */
    DeleteScss(filepath:string):ScssEntry{
        let index=this.cache.findIndex(value=>value.filepath==filepath);
        if(index!=-1){
            let res=this.cache.splice(index,1);
            return res[0];
        }
        return null;
    }
    /**
     * 获取样式
     */
    GetScss(name:string){
        return this.cache.find(value=>value.name==name);
    }
    /**
     * 修改样式
     */
    ChangeScss(entry:ScssEntry):boolean{
        let exist=this.cache.find(value=>value.filepath==entry.filepath);
        if(exist){
            exist.name=entry.name;
            exist.css=entry.css;
            return true;
        }
        return false;
    }
    GetAllNeedUpdates(filepath:string):ScssEntry[]{
        let all:{entry:ScssEntry,dirty:boolean,checked:boolean}[]=[];
        this.cache.forEach(entry=>{
            all.push({dirty:false,entry:entry,checked:false});
        });
        all.forEach(item=>{
            if(item.entry.filepath==filepath || item.entry.dependencies.indexOf(filepath)!=-1){
                item.dirty=true;
            }
        });
        let over=false;
        while(!over){
            over=true;
            all.forEach(item=>{
                if(item.dirty && !item.checked){
                    item.checked=true;
                    all.forEach(child=>{
                        if(!child.dirty && child.entry.dependencies.indexOf(item.entry.filepath)!=-1){
                            child.dirty=true;
                            over=false;
                        }
                    });
                }
            });
        }
        let needupdates:ScssEntry[]=[];
        all.forEach(item=>{
            if(item.dirty)
                needupdates.push(item.entry);
        });
        return needupdates;
    }
}
class ScssParser{

}
function parseDependency(content:string,dir:string):string[]{
    let depends:string[]=[];
    let rows=content.split("\n");
    rows.forEach(row=>{
        let array=row.match(/\/\/\s*@import\s+"(\w+)"\s*/);
        if(array){
            depends.push(path.resolve(dir,array[1]));
        }
    });
    return rows;
}
function extractScss(dir:string){
    let files=fs.readdirSync(dir,{withFileTypes:true});
    files.forEach(file=>{
        if(file.isDirectory()){
            extractScss(path.resolve(dir,file.name));
        }else{
            if(file.isFile()){
                if(path.extname(file.name)==".scss"){
                    let res=parseScss(path.resolve(dir,file.name));
                    if(res){
                        scssManager.AddScss(res);
                    }
                }
            }
        }
    });
}

function parseScss(filepath:string):ScssEntry{
    let content=fs.readFileSync(filepath,{encoding:"utf8"}).trim();
    let dir=path.dirname(filepath);
    let index=content.indexOf("\n");
    if(index!=-1){
        let firstline=content.slice(0,index);
        if(firstline){
            let array=firstline.match(/\/\/\s*@style\s+(\w+)\s*/);
            if(array){
                let scsscontent=content.slice(index+1);
                let depends=parseDependency(scsscontent,dir);
                let result=sass.renderSync({data:scsscontent,includePaths:[dir]});
                return {name:array[1],css:result.css.toString(),filepath:filepath,dependencies:depends};
            }
        }
    }
    return null;
}


//scss存放目录
const SRC_DIR=path.resolve(process.cwd(),"src/www");
let scssManager=new ScssManager();
extractScss(SRC_DIR);

interface ChangeMsg{
    type:"delete"|"change"|"add",
    css?:string,
    name:string
}
type ChangeCallback=(data:ChangeMsg[])=>void;
let changeCallback:ChangeCallback;

//监视src文件夹，当有scss文件发生变化时同步到目标文件夹
fs.watch(SRC_DIR,{recursive:true},(event,file)=>{
    if(file.endsWith(".scss")){
        let src=path.resolve(SRC_DIR,file);
        switch(event){
            case "change":
                //文件内容发生改动
                let needupdates=scssManager.GetAllNeedUpdates(src);
                let msgs:ChangeMsg[]=[];
                needupdates.forEach(entry=>{
                    let res=parseScss(entry.filepath);
                    if(res){
                        scssManager.ChangeScss(res);
                        if(res.name==entry.name)
                            msgs.push({type:"change",css:res.css,name:res.name});
                        else{
                            msgs.push({type:"delete",name:entry.name});
                            msgs.push({type:"add",css:res.css,name:res.name});
                        }
                    }else{
                        scssManager.DeleteScss(entry.filepath);
                        msgs.push({type:"delete",name:entry.name});
                    }
                });
                if(changeCallback && msgs.length>0){
                    changeCallback(msgs);
                }
                
                break;
            case "rename":
                //文件发生重命名，删除或者新增
                try{
                    fs.accessSync(src);
                    let res=parseScss(src);
                    if(res){
                        scssManager.AddScss(res);
                        if(changeCallback){
                            changeCallback([{type:"add",css:res.css,name:res.name}]);
                        }
                    }
                }catch(err){
                    if(err.code=="ENOENT"){
                        let deleted=scssManager.DeleteScss(src);
                        if(deleted){
                            let updates=scssManager.GetAllNeedUpdates(deleted.filepath);
                            let msgs:ChangeMsg[]=[];
                            updates.forEach(item=>{
                                let res=parseScss(item.filepath);
                                if(res){
                                    scssManager.ChangeScss(res);
                                    msgs.push({type:"change",name:res.name})
                                }
                            });
                            changeCallback([{type:"delete",name:deleted.name}]);
                        }
                    }
                }
                break;
        }
        
    }
    
});

export function GetStyles(styleNames:string[]):ScssEntry[]{
    let entries:ScssEntry[]=[];
    styleNames.forEach(name=>{
        let entry=scssManager.GetScss(name);
        if(entry)
            entries.push(entry);
    });
    return entries;
}
export function WatchScss(callback:ChangeCallback){
    changeCallback=callback;
}