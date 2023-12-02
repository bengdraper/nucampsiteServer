const express = require('express');
const promotionRouter = express.Router();

promotionRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end('Will send all promotions...');
})
.post((req, res) => {
    res.end(`will add promotion: ${req.body.name} with description: ${req.body.description}`);
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions')
})
.delete((req, res) => {
    res.end('Deleting all promotions');
});


promotionRouter.route('/:promotionId')
.get((req, res) => {
    res.end(`Will send details of promotion ${req.params.promotionId}`);
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`Post operation not supported on /promotions/${req.params.promotionId}`);
})
.put((req, res) => {
    res.write(`updating the promotion: ${req.params.promotionId}\n`)
    res.end(`Will update promotion: ${req.body.name}
        with description: ${req.body.description}`);
})
.delete((req, res) => {
    res.end(`Deleting promotion: ${req.params.promotionId}`);
});


module.exports = promotionRouter;