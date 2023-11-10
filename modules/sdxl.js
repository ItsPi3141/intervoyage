const WebSocket = require("ws");
const fn_index = {
	generic: 3
};
const params = {
	guidance: 7.5
};

function createImage(/** @type {string} */ prompt, /** @type {string} */ style = "(No style)", /** @type {string} */ negative_prompt = "") {
	const session_hash = Math.random().toString(36).substring(2);
	return new Promise((resolve) => {
		var ws = new WebSocket("wss://google-sdxl.hf.space/queue/join");
		ws.addEventListener("message", (msg) => {
			// Messages are always JSON
			var parsedJson = JSON.parse(msg.data);

			if (parsedJson.msg && parsedJson.msg == "send_hash") {
				ws.send(
					JSON.stringify({
						fn_index: fn_index.generic,
						session_hash: session_hash
					})
				);
			} else if (parsedJson.msg && parsedJson.msg == "send_data") {
				ws.send(
					JSON.stringify({
						data: [prompt, negative_prompt, params.guidance, style],
						event_data: null,
						fn_index: fn_index.generic,
						session_hash: session_hash
					})
				);
			} else if (parsedJson.msg && parsedJson.msg == "process_completed") {
				if (parsedJson.output.error) {
					resolve({
						error: parsedJson.output.error
					});
				} else {
					resolve(parsedJson.output.data[0]);
				}
			}
		});
	});
}

module.exports = {
	createImage
};
