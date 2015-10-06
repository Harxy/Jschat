var request = require("request"),
    extensionHelper = require("./extension-helper.js");

var formatDiceResult = function(dice) {
    return dice
        .map(function (dice) {
            return dice.value;
        })
        .join(", ");
};
var formatDiceRoll = function(dice) {
    return dice
        .map(function (dice) {
            return dice.size.toUpperCase();
        })
        .join(", ");
};

var DiceRollExtension = function(keyword) {
    "use strict";
    return {
        incoming: function (message, callback) {
            var param = extensionHelper.CheckMessageForKeyword(message, keyword, true);
            
            if (!param) {
                callback(message);
                return;
            }

            request({
                url: "http://roll.diceapi.com/json/" + (param ? param : "d6"),
                json: true
            }, function(error, response, body) {
                message.data.name = "dice master";
                if (!error && response.statusCode === 200 && response.body.dice) {
                    var diceResult = formatDiceResult(response.body.dice);
                    var diceRolled = formatDiceRoll(response.body.dice);
                    message.data.text = 'Rolling: ' + diceRolled + '. The result was: ' + diceResult;
                } else {
                    message.data.text = "Sorry something went wrong with my dice.";
                }
                callback(message);
            });
        }
    };
};

module.exports = DiceRollExtension;
