import { AboutPage } from "../www/pages/About";
import { Middleware } from "./core/linked";
export let About: Middleware = function (req, res) {
    let about=new AboutPage(null);
    let tree=about.GetVNode();
    let node=tree.ToHtml();
    let html=`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Demo</title>
    </head>
    <body>
        ${node}
    </body>
    </html>`;
    res.html(html);

};