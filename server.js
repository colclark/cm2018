var path = require('path');
var express = require('express');
var app = express();
const fs = require('fs');

var htmlPath = path.join(__dirname, '/');

app.use(express.static(htmlPath));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const DATA_FILE = 'serverdatas.json'
let serverDatas = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))

app.get('/users', function (req, res) {
    let users = Object.keys(serverDatas.users)
    res.end(JSON.stringify(users))
})

app.get('/bets', function (req, res) {
    res.end(JSON.stringify(serverDatas.users))
})

app.get('/results', function (req, res) {
    
    const phases = {
        QUALIF: { count: 16, points: 1 },
        HUITIEME: { count: 8, points: 2 },
        QUART: { count: 4, points: 4 },
        DEMI: { count: 2, points: 8 },
        FINALE: { count: 1, points: 16 }
    }

    let userResults = {}
    const results = serverDatas.results
    getUsers().forEach(user => {

        let completed = false, score = -1

        const bets = getUserBets(user)
        if (bets) {
            completed = Object.keys(phases).every(phase => {
                return Array.isArray(bets[phase]) && bets[phase].length == phases[phase].count
            })
            score = Object.keys(phases).reduce((currentScore, phase) => {
                let phaseScore = 0
                if (Array.isArray(results[phase]) && Array.isArray(bets[phase])) {
                    phaseScore = results[phase].reduce((acc, countryId) => bets[phase].indexOf(countryId) === -1 ? acc : acc + phases[phase].points, 0)
                }
                return currentScore + phaseScore
            }, 0)

        }
        
        userResults[user] = { user, bets, completed, score }
    });

    res.end(JSON.stringify({ users: userResults, results }))
})

app.get('/logon/:user', function (req, res) {
    const user = serverDatas.users[req.params.user]
    if (user) {
        let result = {
            bets: user.bets || {},
            readOnly: serverDatas.readOnly,
            qualification: serverDatas.qualification
        }
        res.end(JSON.stringify(result))
    } else {
        res.sendStatus(404)
    }
})

app.post('/bets/:user', function (req, res) {

    if (serverDatas.readOnly) {
        res.status(500).send('Update are now disabled')
        return
    }

    let user = serverDatas.users[req.params.user]
    if (!user) {
        res.sendStatus(404)
        return
    }

    if (!req.body.bets) {
        res.status(500).send('Cannot find bets attribute')
        return
    }

    user.bets = req.body.bets
    user.date = new Date().toISOString()
    
    res.sendStatus(200)
    writeServerDatas()
})

var server = app.listen(9000, function () {
    var host = 'localhost';
    var port = server.address().port;
    console.log('listening on http://'+host+':'+port+'/');
});

function writeServerDatas () {
    fs.writeFileSync(DATA_FILE, JSON.stringify(serverDatas))
}

function getUsers () {
    return Object.keys(serverDatas.users)
}

function getUserBets (userName) {
    return serverDatas.users[userName].bets
}