// require the decache module:
import decache from 'decache';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import bodyParser from 'body-parser';

let app = express();
const PORT = 8080;

app.use(cors());
app.use(bodyParser.json());       // to support JSON-encoded bodies

app.post('/plants', (req, res) => { 
    let body = '', 
        json, 
        filePath;

    filePath = __dirname + '/data/plants.json';
    console.log(req);
    try{
        decache(filePath);
        json = require(filePath);
        json.forEach(function(item, i, json) {
            if (item.name == req.body.name) {
                json.splice(i, 1);
            }
        });
    } catch (e) {
        json = [];
    }
    json = [].concat(json, req.body);
    fs.writeFile(filePath, JSON.stringify(json), function() {
        res.end();
    });
});

app.get('/plants', (req, res) => {
    let filePath = __dirname + '/data/plants.json', 
        data;
    try{
        decache(filePath);
        data = require(filePath);
    } catch(e) {
        res.status(404);
    }
    res.json(data);
});

app.get('/plants/:name', (req, res) => {
    let filePath = __dirname + '/data/plants.json', 
        data,
        result;
    try{
        decache(filePath);
        data = require(filePath);
        data.forEach(function(item, i, data) {
            if (item.name == req.params.name) {
                result = item;
            }
        });
    } catch(e) {
        res.status(404);
    }
    res.json(result);
});

app.delete('/plants/:name', (req, res) => {
    let filePath = __dirname + '/data/plants.json', 
        data;
        
    try {
        decache(filePath);
        data = require(filePath);
        
        data.forEach(function(item, i, data) {
            if (item.name == req.params.name) {
                data.splice(i, 1);
            }
        });
    } catch(e) {
        res.status(404);
    }    
    fs.writeFile(filePath, JSON.stringify(data), function() {
        res.end();
    });
});

app.put('/plants/:name', (req, res) => {
    let filePath = __dirname + '/data/plants.json', 
        data;
        
    try {
        decache(filePath);
        data = require(filePath);
        
        data.forEach(function(item, i, data) {
            if (item.name == req.params.name) {
                data.splice(i, 1);
                data = [].concat(data, req.body);
            }
        });
    } catch(e) {
        res.status(404);
    }    
    fs.writeFile(filePath, JSON.stringify(data), function() {
        res.end();
    });
});

app.listen(PORT, () => console.log(`CORS-enabled web server listening on port ${PORT}`));