module.exports = function(app){
    var coffeeshops = require('./controllers/coffeeshops');
    app.get('/coffeeshops/v1/findNearest', coffeeshops.findNearest);
    app.get('/coffeeshops/v1/', coffeeshops.findAll);
    app.get('/coffeeshops/v1/:id', coffeeshops.findById);
    app.post('/coffeeshops/v1', coffeeshops.add);
    app.put('/coffeeshops/v1/:id', coffeeshops.update);
    app.delete('/coffeeshops/v1/:id', coffeeshops.delete);
}