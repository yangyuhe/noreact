import { Linked } from './core/linked';
import http from 'http';
export let test = new Linked();
test.Get('/custom', (req, resp, next) => {
    let body = '[{"name":"housecard","data":{}}]';
    let client = http.request(
        {
            port: 8001,
            host: '127.0.0.1',
            path: '/custom',
            method: 'POST'
        },
        res => {
            res.pipe(resp);
        }
    );
    client.write(body);
    client.end();
});
