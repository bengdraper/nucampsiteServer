const express = require('express');
const campsiteRouter = express.Router();

campsiteRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();  // continue on
})
.get((req, res) => {
    res.end('Will send all campsites...');
})
.post((req, res) => {
    res.end(`will add campsite: ${req.body.name} with description: ${req.body.description}`);
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /campsites')
})
.delete((req, res) => {
    res.end('Deleting all campsites');
});


campsiteRouter.route('/:campsiteId')
.get((req, res) => {
    res.end(`Will send details of campsite ${req.params.campsiteId}`);
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`Post operation not supported on /campsites/${req.params.campsiteId}`);
})
.put((req, res) => {
    res.write(`updating the campsite: ${req.params.campsiteId}\n`)
    res.end(`Will update campsite: ${req.body.name}
        with description: ${req.body.description}`);
})
.delete((req, res) => {
    res.end(`Deleting campsite: ${req.params.campsiteId}`);
});


module.exports = campsiteRouter;