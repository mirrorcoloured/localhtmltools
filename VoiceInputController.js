export class VoiceInputController {
    constructor({
        final_callback = text => console.log('Final:', text),
        interim_callback = text => console.log('Interim:', text),
        status_callback = status => console.log('Status:', status),
        status_image = null,
        status_asset_path = './',
        auto_stop_on_final = true
        } = {}) {

        this.status_callback = status_callback;
        this.interim_callback = interim_callback;
        this.final_callback = final_callback;
        this.status_image = status_image;
        this.status_asset_path = status_asset_path;
        this.auto_stop_on_final = auto_stop_on_final;
        
        this.initial_status = 'Click on the microphone icon and start speaking.';
        this.interm_transcript = '';
        this.final_transcript = '';
        this.recognizing = false;
        this.error_ignore_onend = false;
        this.start_timestamp;
        this.recognition = new webkitSpeechRecognition();

        if (this.status_image.nodeName) {
            this.status_image.addEventListener("click", this.toggleListening.bind(this));
        }

        if (!('webkitSpeechRecognition' in window)) {
            this.status_callback('Web Speech API is not supported by this browser.')
            return;
        } else {
            this.status_callback(this.initial_status);
            this.setup();
        }
    }
    
    setup() {
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
    
        this.recognition.onstart = this.on_start.bind(this);
        this.recognition.onerror = this.on_error.bind(this);
        this.recognition.onend = this.on_end.bind(this);
        this.recognition.onresult = this.on_result.bind(this);
    }

    on_start(event) {
        this.recognizing = true;
        this.status_callback('Speak now');
        this.set_icon('listening');
    }

    on_error(event) {
        this.set_icon('disabled');
        this.status_callback('Click the "Allow" button above to enable your microphone.')

        if (event.error == 'no-speech') {
            this.status_callback('No speech was detected. You may need to adjust your microphone settings.');
            this.error_ignore_onend = true;
        }
        if (event.error == 'audio-capture') {
            this.status_callback('No microphone was found. Ensure that a microphone is installed and that microphone settings are configured correctly.')
            this.error_ignore_onend = true;
        }
        if (event.error == 'not-allowed') {
            if (event.timeStamp - this.start_timestamp < 100) {
                this.status_callback('Permission to use microphone is blocked.')
            } else {
                this.status_callback('Permission to use microphone was denied.')
            }
            this.error_ignore_onend = true;
        }
    }

    on_end(event) {
        this.recognizing = false;
        if (this.error_ignore_onend) {
            this.error_ignore_onend = false;
            return;
        }
        this.set_icon('ready');
        this.status_callback(this.initial_status);
    }

    on_result(event) {
        this.interim_transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                this.final_transcript += event.results[i][0].transcript;
                this.final_callback(this.final_transcript);
                if (this.auto_stop_on_final) {
                    this.toggleListening(event)
                }
                this.final_transcript = '';
            } else {
                this.interim_transcript += event.results[i][0].transcript;
                this.interim_callback(this.interim_transcript);
            }
        }
    }

    toggleListening(event) {
        if (!this.recognizing) {
            this.recognition.start();
            this.status_callback('Click the "Allow" button above to enable your microphone.')
            this.start_timestamp = event.timeStamp;
        } else {
            this.recognition.stop();
        }
    }
    
    /**
     * 
     * @param {string} icon_type should be one of ['ready', 'listening', or 'disabled']
     */
    set_icon(icon_type) {
        if (this.status_image.nodeName) {
            if (icon_type == 'ready') {
                this.status_image.src = this.status_asset_path + 'mic.gif';
            } else if (icon_type == 'listening') {
                this.status_image.src = this.status_asset_path + 'mic-animate.gif';
            } else if (icon_type == 'disabled') {
                this.status_image.src = this.status_asset_path + 'mic-slash.gif';
            }
        }
    }
}