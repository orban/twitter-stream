var sys     = require('util'),	
	express = require('express'),
	twitter = require('ntwitter'),
	http	= require('http');

var app = express();
var server = http.createServer(app);


app.configure(function(){
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get('/', function(req, res, next){
  res.render('/public/index.html');
});

console.log('Server running at http://localhost:8081/');

//var io  = require('socket.io').listen(app);
var io = require('socket.io').listen(server);
io.set('log level', 1);
server.listen(8081);

myList = [];
Array.prototype.del = function(val) {
    for(var i=0; i<this.length; i++) {
        if(this[i] == val) {
            this.splice(i, 1);
            break;
        }
    }
}

CreateTwitter();
io.sockets.on('connection', function(socket) {
    socket.on('data', function(action,data) {
	if(action==='+') {
        	myList.push(data);
	}
	else {
		myList.del(data);
	}
    });
    socket.on('getfilter', function() {
        socket.emit('pushfilter', myList);
    });
    if(myList.length!=0) {
        twit.stream('statuses/filter',{track:myList}, function(stream) {
            stream.on('data', function (tweet) {
  	    	    socket.emit('message', JSON.stringify(tweet));
            });
        });
    }   
});

function CreateTwitter() {
twit = new twitter({
	consumer_key: 'grCZGQ4aNUJpuegc18Zvng',
    consumer_secret: 'lyfXpkspgMLcwURhm6JMnvcft4eIV999ECyTW9cgdKY',
    access_token_key: '709829016-ZVHfzyXPfttrahyGwUAOasWK7wDNE2KihL4mPJ6t',
    access_token_secret: 'Cs5eyq3ZIakPsrObvmbCNdLP1cxx5XmGwCic8gTgc'
});
}
