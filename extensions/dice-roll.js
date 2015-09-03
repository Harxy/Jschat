var request = require("request");
var DiceRollExtension = function(diceMeKeyword) {
    "use strict";
    return {
        incoming: function (message, callback) {
            if (!message.data || !message.data.text) {
                callback(message);
                return;
            }
            if (message.data.text.indexOf(diceMeKeyword) !== 0) {
                callback(message);
                return;
            }
            var param = message.data.text.slice(diceMeKeyword.length).trim();
            request({
                url: "http://roll.diceapi.com/json/" + (param ? param : "d6"),
                json: true
            }, function(error, response, body) {
                message.data.name = "dice master";
                if (!error && response.statusCode === 200) {
                  var diceResult = response.body.dice
                    .map(function(dice){return dice.value;})
                    .join(", ");
                  message.data.text = 'The result was: ' + diceResult;
                } else {
                  message.data.text = "Sorry something went wrong with my dice.";
                }
                callback(message);
            });
        }
    };
};

module.exports = DiceRollExtension;
