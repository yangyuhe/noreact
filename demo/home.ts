import {AboutPage} from "../www/pages/About";
document.addEventListener("DOMContentLoaded",()=>{
    let about=new AboutPage(null);
    let tree=about.GetVNode();
    let dom=tree.ToDom();
    document.body.append(dom);
    tree.Rendered();
});