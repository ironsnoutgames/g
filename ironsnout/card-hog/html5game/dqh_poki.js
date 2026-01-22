/// Poki Iron Snout

function poki_loading_finished() {
	poki_log("Loading finished");
	sdk.gameLoadingFinished();
}

function poki_loading_update(percents) {
	sdk.gameLoadingProgress({percentageDone: percents});
}

function poki_gameplay_start(reason) {
	poki_log("Gameplay Start: " + reason);
	sdk.gameplayStart(reason);		
}

function poki_gameplay_stop(reason) {
	poki_log("Gameplay Stop: " + reason);
	sdk.gameplayStop(reason);
}

function poki_happy(value) {
	console.log("Happy: " + value);
	sdk.happyTime(value);
}

function poki_break(tag) {
	poki_callback("poki.break.started");
	sdk.commercialBreak().then(function(){
		poki_callback("poki.break.completed");
	});
}

function poki_rewarded_break(tag) {
	poki_callback("poki.rewarded.started");
    
	sdk.rewardedBreak().then(
		(withReward) => {
			if (withReward) {
				poki_callback("poki.rewarded.completed");
			} else {
				poki_callback("poki.rewarded.failed");		
			}
		}
	);
}


function poki_callback(event) {
	gmCallback.game_callback(event);	
}
