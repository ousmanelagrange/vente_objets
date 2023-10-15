const mongoose = require('mongoose');
const express = require("express");
const Thing = require('./models/thing');

const app = express();

mongoose.connect('mongodb+srv://lagrange:lagrange@cluster1.lxerdej.mongodb.net/?retryWrites=true&w=majority', 
    {
        useNewUrlParser : true,
        useUnifiedTopology : true
    }
).then(() => console.log('connexion à MongoDB réussie !'))
.catch(() => console.log('connexion à mMongoDb échouée !'));


/** 
 * le midleware qui suivra fera en sorte que Express prenne toutes les requêtes
 * qui ont comme Content-Type "application/json" et mette à disposition leur "body"
 * directement sur l'objet req, ce qui nous permet d'écrire le middleware POST
*/
app.use(express.json());

app.use((req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
} );

app.post('/api/stuff',(req, res, next) => {
    delete req.body._id;
    const thing = new Thing({
        ...req.body
    });
    thing.save()
        .then(() => res.status(201).json({message : 'Objet enregistré'}))
        .catch(error => res.status(400).json({error}));
});

app.get('/api/stuff', (req, res, next) => {
    Thing.find()
        .then(things => res.status(200).json(things))
        .catch(error => res.status(400).json({error}));
});


module.exports = app;

