const restify = require('restify')

const BOT_NAME = 'PES Bot'

// Setup server

var server = restify.createServer()
server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.queryParser())
server.use(restify.plugins.bodyParser())

server.post('/', function (req, res, next) {
	switch (req.body.type) {
    case 'ADDED_TO_SPACE':
      res.send(handleAddToSpace(req.body))
      break
    case 'MESSAGE':
      res.send(handleMessage(req.body))
      break
    case 'CARD_CLICKED':
      res.send(handleCardClick(req.body))
      break
  }
  return next()
})

server.listen(process.env.port || process.env.PORT || 8080, function () {
   console.log('%s listening to %s', server.name, server.url) 
})

// Handlers

function handleAddToSpace() {
	return getWelcomeMessage()
}

function handleMessage(body) {
	const text = cleanText(body.message.text)
  switch (text) {
    case 'teams':
    case 'team':
    case 'equipos':
    case 'equipo':
      return getTeamsCard()
    default:
    	return getDefaultMessage()
  }
}

function handleCardClick() {
	return getDefaultMessage()
}

// Responses

function getWelcomeMessage() {
	return {
		text: "Welcome!!!!"
	}
}

function getTeamsCard() {
	return {
		  cards: [
		    {
		      sections: [
		        {
		          widgets: [
		            {
		              buttons: [
		                {
		                  textButton: {
											  text: "Sorteo de equipazos",
											  onClick: {
											    "openLink": { "url": "https://echaloasuerte.com/draw/5bd08120741c1f4dd4253762/" }
											  }
											}
		                }
		              ]
		            }
		          ]
		        }
		      ]
		    }
		  ]
		}
}

function getDefaultMessage() {
	return {
		text: "Not supported!!!!!"
	}
}

// Utils

function cleanText(text = "") {
  return text
    .toLowerCase()
    .replace(`@${BOT_NAME.toLowerCase()}`, '')
    .split(' ')
    .filter((char) => char !== '')
    .join(' ')
}
