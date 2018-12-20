module.exports=function(content:string){
    return replace(content);
};
function replace(source:string){
    return source.replace(/\/\/\s*@style\s+(\w+)\s*/g,(substr,name)=>{
        return "";
    });
}
