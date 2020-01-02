import http from 'http';
import { Linked, DefaultLinked } from './core/linked';
import { proLinked } from './router-prod';
import React from '../src/noreact';
import config from '../app.json';
import { test } from './router-test';
import { staticLinked } from './static';
import { ServerRender } from '../src/attribute';

let linked = DefaultLinked();
linked.Use((req, res, next) => {
    React.ResetCounter();
    ServerRender(true);
    next();
});
linked.Use(proLinked);
linked.Use(test);
linked.Use(staticLinked);

let server = http.createServer((req, res) => {
    linked.Startup(req, res);
});

server.listen(config.node_port, config.node_host, () => {
    console.log(
        'nodejs start listening at http://' +
        config.node_host +
        ':' +
        config.node_port
    );
});
