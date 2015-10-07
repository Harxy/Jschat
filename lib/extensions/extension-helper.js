  var CheckMessageForKeyword = function(message, keyword, hasParameters) {
        if (!message.data || !message.data.text) {
            return null;
        }

        var keywordRegex;

        if (hasParameters) {
            keywordRegex = new RegExp("^\\s*" + keyword + "\\s*(\\S.+?)\\s*$", "i");
            var params = message.data.text.match(keywordRegex);

            if (params === null) {
                return false;
            }

            return params[1];
        } else {
            keywordRegex = new RegExp("^\\s*" + keyword + "\\s*$", "i");
            var matched = keywordRegex.test(message.data.text);
            return matched;
        }
    };

function parseURL(url){
    var parsed_url = {};

    if ( url === null || url.length === 0 ) {
        return parsed_url;
    }

    var protocol_i = url.indexOf('://');
    parsed_url.protocol = url.substr(0,protocol_i);

    var remaining_url = url.substr(protocol_i + 3, url.length);
    var domain_i = remaining_url.indexOf('/');
    domain_i = domain_i == -1 ? remaining_url.length - 1 : domain_i;
    parsed_url.domain = remaining_url.substr(0, domain_i);
    parsed_url.path = domain_i == -1 || domain_i + 1 == remaining_url.length ? null : remaining_url.substr(domain_i + 1, remaining_url.length);

    var domain_parts = parsed_url.domain.split('.');
    switch ( domain_parts.length ){
        case 2:
            parsed_url.subdomain = null;
            parsed_url.host = domain_parts[0];
            parsed_url.tld = domain_parts[1];
            break;
        case 3:
            parsed_url.subdomain = domain_parts[0];
            parsed_url.host = domain_parts[1];
            parsed_url.tld = domain_parts[2];
            break;
        case 4:
            parsed_url.subdomain = domain_parts[0];
            parsed_url.host = domain_parts[1];
            parsed_url.tld = domain_parts[2] + '.' + domain_parts[3];
            break;
    }

    parsed_url.parent_domain = parsed_url.host + '.' + parsed_url.tld;

    return parsed_url;
}

module.exports = {CheckMessageForKeyword:CheckMessageForKeyword,
                  parseURL:parseURL};
