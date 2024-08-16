import { LightningElement } from 'lwc';
import My_Resource from '@salesforce/resourceUrl/BackspaceIcon';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { loadScript } from 'lightning/platformResourceLoader';
import TWILIO_SDK from '@salesforce/resourceUrl/Javascript_sdk';
import generateTwilioToken from '@salesforce/apex/TwilioTokenProvider.getTwilioToken';

export default class SoftPhone extends LightningElement {
    phoneNumber = '';
    callStatus;
    twilioDevice;
    isTwilioLoaded = false;


    dialPad = [['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']];

    get getPhoneNumber() {
        return '+1 ' + this.phoneNumber;
    }

    get getBackspaceIcon() {
        return My_Resource;
    }

    connectedCallback() {
        this.loadTwilioSDK();
    }

    handleOnChange() {

    }

    enterNumber(event) {
        if (this.phoneNumber.length >= 10) { return; }
        this.phoneNumber += event.currentTarget.dataset.value;
    }

    handleBackSpace() {
        var numbers = this.phoneNumber.split('');
        numbers[numbers.length - 1] = '';
        this.phoneNumber = numbers.join('');
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
                this.callStatus = 'Error loading Twilio SDK: ' + error.message;
                this.showNotification('Twilio SDK Loading ', this.callStatus, 'error');
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
                    this.showNotification('Twilio Device error', this.callStatus, 'error');
                });
                this.twilioDevice.on('incoming', connection => {
                    this.callStatus = 'Incoming call from ' + connection.parameters.From;
                    console.log('this.callStatus ' + this.callStatus);
                    connection.accept();
                });

                /*this.twilioDevice.on('connect', (connection) => {
                    this.callStatus = 'Call in progress';
                    this.callSid = connection.parameters.CallSid;
                    console.log('this.callSid ',this.callSid);
                });*/
            })
            .catch(error => {
                this.callStatus = 'Error fetching Twilio token';
                console.log('Error fetching Twilio token', JSON.stringify(error));
                this.showNotification('Twilio token ', this.callStatus, 'error');
            });
    }


    handleCall() {
        try {
            if (!this.twilioDevice) {
                this.callStatus = 'Twilio Device not initialized';
                this.showNotification('Twilio Device ', this.callStatus, 'Warning');
                return;
            } else if (this.phoneNumber.length == 10 && this.phoneNumber != 'undefined' && !this.phoneNumber.includes('*') && !this.phoneNumber.includes('#')) {
                const params = {
                    To: '+91' + this.phoneNumber,
                    From: '+18576757734' // Ensure you pass the correct From number
                };
                this.twilioDevice.connect({ params: params });
                this.twilioDevice.on('error', (error) => {
                    console.log('Twilio Device error: ', error);
                    this.callStatus = 'Twilio Device error: ' + error.message;
                    this.showNotification('Twilio Device error', this.callStatus, 'error');
                });
            } else {
                this.showNotification('Phone Number ', 'Enter valid Phone Number', 'error');
            }
        } catch (error) {
            console.error('Error during call handling:', error);
            this.callStatus = 'Error during call handling' + error.message;
            this.showNotification('Call ', this.callStatus, 'error');
        }
    }

    showNotification(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }
}