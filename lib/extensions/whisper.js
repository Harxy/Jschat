var WhisperExtension = {
    incoming: function (message, callback) {
        if (message.data && message.data.text) {
            var whisperPattern = /^~.*~/i;
            var matched = message.data.text.match(whisperPattern);
            
            if (matched && matched.length > 0) {
                message.data.text = message.data.text.replace(whisperPattern, '').trimLeft();
                message.data.recipient = matched[0].replace(/~/g, '');
            }
        }

        callback(message);
    }
};

module.exports = WhisperExtension;