module.exports = function(content: string) {
    content = replace(content);
    return content;
};
function replace(source: string) {
    return source.replace(
        /\/\*\*\s*@import\s+(".+")\s*\*\//g,
        (substr, name) => {
            return `import ${name};\n`;
        }
    );
}
