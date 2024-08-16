import { LightningElement, api } from 'lwc';
import humancontactpersonicon from '@salesforce/contentAssetUrl/humancontactpersoniconpng';
import { loadScript } from 'lightning/platformResourceLoader';
import TWILIO_SDK from '@salesforce/resourceUrl/Twilio';
import generateTwilioToken from '@salesforce/apex/TwilioTokenProvider.getTwilioToken';
export default class SoftphoneCallScreen extends LightningElement {

    humancontactpersonicon = humancontactpersonicon;
    callerName = 'David Brown';
    callerNumber = '+31 786 786 2456';
    callDuration = '00:00:00';
    showPopup = false;
    timer;
    startTime;

    @api incoming = false;
    @api received = false;
    @api outgoing = false;

    callStatus;
    twilioDevice;
    twilioLoaded = false;
    isTwilioLoaded = false;

    connectedCallback() {
        console.log('Outgoing property in softphone call screen:', this.outgoing + '   ' + this.incoming);
        this.loadTwilioSDK();
    }

    loadTwilioSDK() {
        loadScript(this, TWILIO_SDK)
            .then(() => {
                console.log('Twilio SDK loaded successfully');
                this.isTwilioLoaded = true;
                this.initializeTwilioDevice();
            })
            .catch(error => {
                console.error('Error loading Twilio SDK: ', error);
                this.callStatus = 'Error loading Twilio SDK';
            });
    }

    initializeTwilioDevice() {
        if (!this.isTwilioLoaded) {
            console.log('Twilio SDK not loaded');
            this.callStatus = 'Twilio SDK not loaded';
            return;
        }
        generateTwilioToken()
            .then(token => {
                console.log(JSON.stringify(token));
                this.twilioDevice = new Twilio.Device(token, {
                    codecPreferences: ["opus", "pcmu"],
                    fakeLocalDTMF: true,
                    debug: true, // Enable debugging to help trace issues
                    enableRingingState: true,
                    logLevel: '1',
                });
                this.twilioDevice.register();
                this.twilioDevice.on('error', (error) => {
                    console.log('Twilio Device error: ', error);
                    this.callStatus = 'Twilio Device error: ' + error.message;
                });
            })
            .catch(error => {
                this.callStatus = 'Error fetching Twilio token';
                console.log('Error fetching Twilio token', JSON.stringify(error));
                //console.error('Error fetching Twilio token', error);
            });
    } 

    startTimer() {
        this.startTime = new Date();
        this.timer = setInterval(() => {
            const now = new Date();
            const elapsed = now - this.startTime;
            this.callDuration = this.formatDuration(elapsed);
        }, 1000);
    }

    formatDuration(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    async handleAcceptCall() {
        this.received = true;
        this.incoming = false;
        this.outgoing = false;
        this.callDuration = '00:00:00';
        await this.twilioDevice.on('incoming', connection => {
            this.callStatus = 'Incoming call from callScreen' + connection.parameters.From;
            console.log('this.callStatus callScreen' + connection);
            connection.accept();
        });
        this.startTimer();
    }

    rejectIncomingCall() {
        this.received = false;
        this.incoming = false;
        this.outgoing = true;

    }

    handleEndCall() {
        this.callDuration = '00:00:00';
        clearInterval(this.timer);
        this.received = false;
        this.incoming = true;
        this.twilioIncoming.on('Hangup', connection => {
            //this.callerNumber = 'Incoming call from ' + connection.parameters.From;
            console.log('this.callStatus ' + connection);
            connection.disconnect();
        });
    }

    handleOpenPopup() {
        this.showPopup = true;
    }

    handleClosePopup() {
        this.showPopup = false;
    }
}