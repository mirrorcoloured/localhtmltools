import {VoiceInputController} from "./VoiceInputController.js";

const VIC = new VoiceInputController({
	final_callback: function(text) {
		document.querySelector('#final_span').innerHTML = text;
	},
	interim_callback: function(text) {
		document.querySelector('#interim_span').innerHTML = text;
	},
	status_callback: function(text) {
		document.querySelector('#inp_command').placeholder = text;
	},
	status_image: document.querySelector("#start_img"),
	status_asset_path: './',
	auto_stop_on_final: true,
	}
);