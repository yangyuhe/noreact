import fs from "fs";
import path from "path";
import sass from "node-sass";

export function extractScss(dir:string){
    let files=fs.readdirSync(dir,{withFileTypes:true});
    files.forEach(file=>{
        if(file.isDirectory()){
            extractScss(path.resolve(dir,file.name));
        }else{
            if(file.isFile()){
                if(path.extname(file.name)==".scss"){
                    let content=fs.readFileSync(path.resolve(dir,file.name),{encoding:"utf8"}).trim();
                    let index=content.indexOf("\n");
                    if(index!=-1){
                        let firstline=content.slice(0,index);
                        if(firstline){
                            let array=firstline.match(/\/\/\s*@style\s+(\w+)\s*/);
                            if(array){
                                let scsscontent=content.slice(index+1);
                                let result=sass.renderSync({data:scsscontent,includePaths:[dir]});
                                cache[array[1]]=result.css.toString();
                            }
                        }
                    }
                    
                }
            }
        }
    });
}
let cache:{[name:string]:string}={};
extractScss(path.resolve(__dirname,"../src/www"));
export function GetStyles(styleNames:string[]){
    let css:string[]=[];
    styleNames.forEach(name=>{
        css.push(cache[name]);
    });
    return css.join("");
}