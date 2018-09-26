const express = require('express');
const jsonfile = require('jsonfile');

const FILE = 'pokedex.json';



/**
 * ===================================
 * Configurations and set up
 * ===================================
 */

// Init express app
const app = express();

/**
 * ===================================
 * Routes
 * ===================================
 */

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

var createHtmlPagePokemon = function(request, response){
    jsonfile.readFile(FILE, (err, obj) =>{
        var newEmpArray = [];
        var pokemonObj = obj.pokemon;
        var html = '<html><body><h1>Form for new pokemon: </h1>';
        html += '<form method="POST" action="/pokemon">';
        html += 'Id Number:<br> <input type="text" name="id"><br>';
        html += 'Number:<br> <input type="text" name="num"><br>';
        html += 'Name:<br> <input type="text" name="name"><br>';
        html += 'Image:<br> <input type="text" name="img"><br>';
        html += 'Height:<br> <input type="text" name="height"><br>';
        html += 'Weight:<br> <input type="text" name="weight"><br>';
        html += '<input type="submit" value="Submit"><br>';
        html += '</form></body></html>';

        //console.log(html);
        response.send(html);
    })
}

app.get('/pokemon/new', createHtmlPagePokemon);

app.post('/pokemon', (request, response) =>{
    console.log(request.body);
    var requestOrd = request.body;
    let file = 'pokedex.json';
    //const obj = request.body;
    let objFromHtml = {
        id: parseInt(requestOrd['id']),
        num: requestOrd['num'],
        name: requestOrd['name'],
        img: requestOrd['img'],
        height: requestOrd['height'],
        weight: requestOrd['weight']
    }

    jsonfile.readFile(file, (err,obj)=>{
        obj['pokemon'].push(objFromHtml);

        jsonfile.writeFile(file, obj, function(err){
            if (err){
                console.log("ERROR: ", err);
            }
            response.send("Yay added successfully!");
        });

    })


})

app.get('/:id', (request, response) => {

  // get json from specified file
  jsonfile.readFile(FILE, (err, obj) => {
    // obj is the object from the pokedex json file
    // extract input data from request
    let inputId = parseInt( request.params.id );

    var pokemon;

    // find pokemon by id from the pokedex json file
    for( let i=0; i<obj.pokemon.length; i++ ){

      let currentPokemon = obj.pokemon[i];

      if( currentPokemon.id === inputId ){
        pokemon = currentPokemon;
      }
    }

    if (pokemon === undefined) {

      // send 404 back
      response.status(404);
      response.send("not found");
    } else {

      response.send(pokemon);
    }
  });
});

app.get('/', (request, response) => {
  //create a sort by button
  var buttonPage = '';
  buttonPage += '<html><body><h1>IF you want to sort the pokemon: </h1><br>';
  //buttonPage += '<input type="button" value="Sort By Name">';
  buttonPage += '<a href="/pokemon?sortby=name">Sort by name</a>';
  buttonPage += '</body></html>';


  response.send(buttonPage);
});

/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
app.listen(3000, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));
