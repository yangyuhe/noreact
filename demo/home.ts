import {AboutPage} from "../www/pages/About";
document.addEventListener("DOMContentLoaded",()=>{
    let about=new AboutPage(null);
    let dom=about.ToDom();
    document.body.append(dom);
    about.Rendered();
});