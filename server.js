const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const Mega = require('megadb');
const sitesCadastrados = new Mega.crearDB('Sites')


app.get("/*", async(req, res) => {
    try {
        res.send(await sitesCadastrados.obtener('SITES'));
    } catch(err) {
        if (err) 1 * 1
    }
})


server.listen(3000);
