const child_process=require("child_process");
let npm=child_process.spawn("npm",["run","watch"]);
npm.stdout.on("data",data=>{
    console.log("hexiang-"+data);
});
npm.stderr.on("data",data=>{
    console.log("hexiang-err"+data);
});
