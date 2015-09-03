var request = require("request");

var ScriptFilterExtension = {
  incoming: function (message, callback) {
    if (message.data && message.data.text) {
      message.data.text = message.data.text.filterOutScriptTags();
    }

    callback(message);
  }
};

String.prototype.filterOutScriptTags = function () {
    var i = 0, scriptTagLevel = 0;
    var result = "";
    var str = this.toString();
    while (i < str.length) {
        // if we're at the start of a script tag, increase the scriptTagLevel
        if (str.length - i >= 7 && str.substring(i, i + 7) == "\<script") {
            scriptTagLevel++;
            i = i + 7;
        // if we're at the end of a script tag, decrease the scriptTagLevel (don't let it go below 0)
        } else if (str.length - i >= 9 && str.substring(i, i + 9) == "\</script\>") {
            if (scriptTagLevel > 0) {
                scriptTagLevel--;
            }

            i = i + 9;
        // else, use the scriptTagLevel to determine whether to include the text or not
        } else {
            if (scriptTagLevel == 0) {
                result += str[i];
            }

            i++;
        }
    }

    return result;
};

module.exports = ScriptFilterExtension;
