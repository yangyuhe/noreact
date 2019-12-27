import { Middleware } from './linked';
declare module 'http' {
    interface ServerResponse {
        html(html: string): void;
    }
}

const HTMLMiddleware: Middleware = function(req, resp, next) {
    resp.html = function(html: string) {
        resp.setHeader('Content-Type', 'text/html');
        resp.write(html);
        resp.end();
    };
    next();
};
export default HTMLMiddleware;
