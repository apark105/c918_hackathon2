$(document).ready(init);


// var arrayOfPlayers = ["HafiDHimMi", "nickmercs", "arteezy", "sexyBamboe"];

var arrayOfPlayers = [];

var arrayCommaString = arrayOfPlayers.join();
var twitchStreamer = "ninja";
var onlinePlayerArray = [];

var dotaPlayers = {
    masondota2: "315657960",
    dendi: "70388657",
    arteezy: "104070670",
    sexyBamboe: "20321748",
    singsing: "97577101",
    darskyl: "161444478"
}

var bfPlayers = {
    twistydoesntmiss: 'TwistyDoesntMlSS',
    dazs: 'Ascend_Dazs',
    Boccarossa13: 'Boccarossa',
    misterkaiser: 'Mister_Kaiser',
    mistersamonte: 'MisterSamonte',
    Gen_Odyssey: 'Gen-Odyssey'

};

var fortniteTopPlayers = {
    'Ninja': 'Ninja',
    'NickMercs': 'NICKMERCS',
    'TwitchProspering': 'TwitchProspering',
    'twitch_bogdanakh': 'twitch_bogdanakh',
    'TSM_Myth': 'TSM_Myth',
    'CourageJD': 'CourageJD',
    'Dakotaz': 'Dakotaz',
    'Ranger': 'WBG Ranger',
    'SypherPK': 'SypherPK'

}


// var leaguePlayser = {
//     froggen: '71899217'
// }

//detFortnitePlayerData('NickMercs');


var gameData = [];


var gameDataBf;
var gameDataFortNite;
var gameDataDota = {};
var gameDataLeague = {};


function init () {
    createAllPlayersArray(dotaPlayers, bfPlayers, fortniteTopPlayers);
    getOnlinePlayers();
//    getLeaguePlayers()
}

function createAllPlayersArray(firstArray, secondArray, thirdArray){
    var newArray = [firstArray,secondArray,thirdArray]
    console.log(thirdArray);
    for (var arrayIndex = 0; arrayIndex < newArray.length; arrayIndex++){
        arrayOfPlayers.push(...Object.keys(newArray[arrayIndex]));

    }


}

function getBfPlayerData (player) {
    var ajaxConfig = {
        url: "https://danielpaschal.com/lfzproxies/battlefieldproxy.php",
        method: "GET",
        dataType:'Json',
        data: {
            platform: 3,
            displayName: player
        },
        headers: {
            "TRN-Api-Key": "2e1d6fb9-7bd6-4cd5-8121-2eeb037845eb"
        },
        success: function (response) {
            var wins = response.result.basicStats.wins;
            var losses = response.result.basicStats.losses;
            var kills = response.result.basicStats.kills;
            var deaths = response.result.basicStats.deaths;
            var accuracyRatio = response.result.accuracyRatio;
            gameDataBf = {'Player': player, 'Wins': wins, 'Losses': losses, 'Kills': kills, 'Deaths': deaths, 'Accuracy Ratio': accuracyRatio}
        }
    }
    $.ajax(ajaxConfig)
}


function getOnlinePlayers(){
    var arrayCommaString = arrayOfPlayers.join();
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.twitch.tv/kraken/streams?channel="+arrayCommaString,
        "method": "GET",
        "headers": {
            "Client-ID": "2jfkzp4pqy42ge7y17na6l0kf8fdtx",
        }
    }
    $.ajax(settings).done(function (response) {
        makeOnlinePlayerObj(response)
        renderLivePlayersOnDom();
    });

}

function makeOnlinePlayerObj(response){
    for (var i=0; i<response.streams.length; i++) {
        var tempPlayerObj = {};
        var streamingGame = response.streams[i].game;
        var thumbnail = response.streams[i].preview.large;
        var displayName = response.streams[i].channel.display_name;
        var status = response.streams[i].channel.status;
        var viewers = response.streams[i].viewers;

        tempPlayerObj.game = streamingGame;
        tempPlayerObj.thumbnail = thumbnail;
        tempPlayerObj.displayName = displayName;
        onlinePlayerArray.push(tempPlayerObj);

        //console.log(response);
        //console.log('GAME: ', onlinePlayerArray);

    }}

function getDotaPlayers(player){
    gameDataDota.Player = player;
    var accountInfo = {
        "url": "https://api.opendota.com/api/players/"+player,
        "method": "GET"
    }

    var winLoss = {
        "url": "https://api.opendota.com/api/players/"+player+"/wl",
        "method": "GET"
    }

    var previousGame = {
        "url": "https://api.opendota.com/api/players/"+player+"/matches",
        "method": "GET"
    }

    $.ajax(accountInfo).done(function (response) {
        gameDataDota.SoloRank = response.solo_competitive_rank
    });

    $.ajax(winLoss).done(function (response2) {
        gameDataDota.Wins = response2.win;
        gameDataDota.Loses = response2.lose;
    });

    $.ajax(previousGame).done(function (response3) {
        gameDataDota.Kills = response3[0].kills;
        gameDataDota.Deaths = response3[0].deaths;
        gameDataDota.Assists = response3[0].assists;
        if(response3[0].radiant_win === false){
            gameDataDota.Win = "lost"
        }else{
            gameDataDota.Win = "win"
        }
    });
}

var fortnitePlayersData = [];

function detFortnitePlayerData(playerName) {
    var fortniteStatsObject = {};
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://danielpaschal.com/lfzproxies/fortniteproxy.php",
        "method": "GET",
        dataType: 'json',
        data:{
            platform: 'pc',
            player: playerName,
        },
        "headers": {
            "TRN-Api-Key": "516f26d7-878d-41f9-b03e-df2ad5a11530",
        }
    }

    $.ajax(settings).done(function (response) {

        apiCallDataForTwitchProspering = response;
    });

    fortnitePlayersData = response;
    console.log(fortnitePlayersData);
    for (var index = 6; index < fortnitePlayersData.lifeTimeStats.length; index++){
        fortniteStatsObject[fortnitePlayersData.lifeTimeStats[index].key]=fortnitePlayersData.lifeTimeStats[index].value;
    }

}


function renderLivePlayersOnDom() {

    for (let i=0; i<onlinePlayerArray.length;i++){

        let playerCard = $("<div>", {
            addClass: "playerCard",
            css: ({"background-image": "url("+onlinePlayerArray[i].thumbnail+")"}),
            on: {
                click: function() {
                    let streamName = onlinePlayerArray[i].displayName
                    displayVideo(streamName);
                    console.log(i)
                    let gameName = onlinePlayerArray[i].game;
                    console.log(gameDataFetch(gameName));
                    // displayStats(gameDataFetch(gameName));
                    //
                    //function to sort which gameDataFetch function to call.
                }
            },
            appendTo: $("#livePlayers"),
        })
    }
}
//convert twitch name to gameID
//gamer name
function displayVideo(twitchName) {
    $('.container').empty();
    console.log(twitchName);
    var createIframe = $('<iframe>', {
        addClass: 'currentVideo',
        attr: ({
            'src': `https://player.twitch.tv/?channel=${twitchName}&muted=true`,
            'height': "720",
            'width': "1280",
            'frameborder': "0",
            'scrolling': "no",
            'allowfullscreen': "true"
        }),
        appendTo: $('.container')
    })
    //             //need to grab data from obj using
    // displayStats(gameDataBf);
}


function displayStats(gameObj) {
    var overallStatsDiv = $('<div>').attr('id', 'stats')
    for (var key in gameObj) {
        var statsCont = $('<div>').addClass('statsCont');
        var statKey = $('<div>').addClass('statKey').text(key);
        var statVal = $('<div>').addClass('statValue').text(gameObj[key]);
        statsCont.append(statKey, statVal);
        overallStatsDiv.append(statsCont);
    }
    $('.container').append(overallStatsDiv)
}

function gameDataFetch (game) {
    //if fortnite, call that function data and grab that info
    switch (game) {
        case 'Fortnite':
            console.log('fortnite')
            break;
        case 'Dota 2':
            console.log('Dota 2')
            //code
            break;
        case 'Battlefield 1':
            console.log('Battlefield 1')
            //code
            break;
    }
    //if battlefield, call that function data
    //if dota, call that function data

}

// function getLeaguePlayers(){
//     var accountInfo = {
//         "url": "https://na1.api.riotgames.com/lol/summoner/v3/summoners/71899217?api_key=RGAPI-25569727-3b8d-4531-ad45-b80cd4d1a8f3",
//         "method": "GET",
//         dataType: "json"
//         }

//       $.ajax(accountInfo).done(function (response) {
//         console.log(response);
//       });
// }