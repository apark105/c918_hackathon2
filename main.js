$(document).ready(init);

var arrayOfPlayers = [];

var twitchStreamer = "ninja";
var onlinePlayerArray = [];

var dotaPlayers = {
    masondota2: "315657960",
    dendi: "70388657",
    arteezy: "104070670",
    sexyBamboe: "20321748",
    singsing: "97577101"
}

var bfPlayers = {
    twistydoesntmiss: 'TwistyDoesntMlSS',
    dazs: 'Ascend_Dazs',
    Boccarossa13: 'Boccarossa',
    misterkaiser: 'Mister_Kaiser',
    mistersamonte: 'MisterSamonte'
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
detFortnitePlayerData('NickMercs');


var gameData = [];

function init () {
    createAllPlayersArray(dotaPlayers, bfPlayers, fortniteTopPlayers);
    getOnlinePlayers();
    console.log('online: ', onlinePlayerArray);

}

function createAllPlayersArray(firstArray, secondArray, thirdArray){
    var newArray = [firstArray,secondArray,thirdArray]
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
            gameData = response;
            var wins = gameData.result.basicStats.wins;
            var losses = gameData.result.basicStats.losses;
            var kills = gameData.result.basicStats.kills;
            var deaths = gameData.result.basicStats.deaths;
            var accuracyRatio = gameData.result.accuracyRatio;
            console.log(wins, losses, kills, deaths, accuracyRatio)
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
        console.log(onlinePlayerArray);
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


        console.log(response);
    }}

function getDotaPlayers(player){
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
        dotaPlayers.soloRank = response.solo_competitive_rank
    });

    $.ajax(winLoss).done(function (response2) {
        dotaPlayers.wins = response2.win;
        dotaPlayers.loses = response2.lose;
    });

    $.ajax(previousGame).done(function (response3) {
        dotaPlayers.kills = response3[0].kills;
        dotaPlayers.deaths = response3[0].deaths;
        dotaPlayers.assists = response3[0].assists;
        if(response3[0].radiant_win === false){
            dotaPlayers.win = "lost"
        }else{
            dotaPlayers.win = "win"
        }
        console.log(dotaPlayers)
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
        fortnitePlayersData = response;
        console.log(fortnitePlayersData);
        for (var index = 6; index < fortnitePlayersData.lifeTimeStats.length; index++){
            fortniteStatsObject[fortnitePlayersData.lifeTimeStats[index].key]=fortnitePlayersData.lifeTimeStats[index].value;
        }

    });
}



function renderLivePlayersOnDom() {

    for (var i=0; i<onlinePlayerArray.length;i++){

        var playerCard = $("<div>").addClass("playerCard").css({
            "background-image": "url("+onlinePlayerArray[i].thumbnail+")",
        })
        $("#livePlayers").append(playerCard);
    }
}
