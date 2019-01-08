import { BaseComponent, ComponentConstructor } from "./core/BaseComponent";

export function GetJSModule(module:string){
        let promise:Promise<ComponentConstructor<any>>;
        if(module=="about-page"){
            promise=import(/*webpackChunkName:"homepage" */"./pages/About").then(module=>{
                return module.AboutPage;
            });
        }
        if(module=="fact"){
            promise=import(/*webpackChunkName:"fact" */"./components/fact/fact").then(module=>{
                return module.MdFact;
            });
        }
        if(module=="team"){
            promise=import(/*webpackChunkName:"team" */"./components/team/team").then(module=>{
                return module.TeamModule;
            });
        }
        if(module=="header"){
            promise=import(/*webpackChunkName:"header" */"./common/header/Header").then(module=>{
                return module.Header;
            });
        }
        if(module=="card"){
            promise=import(/*webpackChunkName:"card" */"./components/card/card").then(module=>{
                return module.Card;
            });
        }
        if(module=="search"){
            promise=import(/*webpackChunkName:"search" */"./components/search/search").then(module=>{
                return module.SearchModule;
            });
        }
        if(!promise)
            throw new Error("no specified module found:"+module);
        return promise;
}

