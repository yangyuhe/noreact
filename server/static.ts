import url from 'url';
import path from 'path';
import { Linked } from './core/linked';
import fs from 'fs';

export let staticLinked = new Linked();

staticLinked.Get('/static', (req, resp) => {
    let pathname = url.parse(req.url).pathname;
    let index = pathname.indexOf('/static');
    let subpath = pathname.substr(index + '/static'.length);
    if (subpath && subpath.indexOf('/') == 0) {
        subpath = subpath.substr(1);
        let fullpath = path.resolve(process.cwd(), 'bundle', subpath);
        let rs = fs.createReadStream(fullpath);
        resp.setHeader('Content-Type', 'text/javascript');
        rs.pipe(resp);
    } else {
        resp.statusCode = 404;
        resp.end('not found');
    }
});
