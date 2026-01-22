const LOCAL_SERVICE_URL = 'http://localhost:3003';

//
//	gameloft integration
//

async function gameloft_send_score(_score) {
  try {
	  var _uuid = url_get_param("uuid");
	  var _partner = url_get_param("partner");
	  var _boards = url_get_param("leaderboards");
	  var _env = url_get_param("env");
	  if (GameloftSendScore && _uuid != "" && _boards != "") {
		await sendScore(_uuid, _partner, _env, _boards, _score);
	  }
  } catch(error) {
	  console.log("error from leaderboards sdk", error);
  }
}

function tuut_level_start() {
	dataLayer.push({
	'event': 'levelStart',

	'publisher': 'TUUT',
	'productKey': GameloftId

	});
}

function tuut_level_end() { 
	dataLayer.push({
	'event': 'levelCompletion',
	'publisher': 'TUUT',
	'productKey': GameloftId
	});
}

const buildServiceUrl = (partner, env) => {
  if(partner === 'local') {
    return LOCAL_SERVICE_URL;
  }
  const suffix = env === 'gold' ? '' : `-${env}`;
  return `https://leaderboards${suffix}.${partner}.gameloftstore.com`;
}

async function sendScore(uuid, partner, env, leaderboards, score) {
  const serviceUrl = buildServiceUrl(partner, env);
  const scoreApiUrl = `${serviceUrl}/leaderboards/data/send`;
  const data = {
    leaderboards_key: leaderboards.split(','),
    user_id: uuid,
    score: score
  };

  const headers = {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    }
  };

  try {
    const result = await fetch(scoreApiUrl, headers);
    const parsed = await result.json();
    if(!('success' in parsed) || parsed.success !== true) {
      throw 'Failed to post score!';
    }
  } catch(error) {
    console.log('[Leaderboards] Error', error);
    throw error;
  }
}

function url_get_param(_key) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === _key) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return "";
}