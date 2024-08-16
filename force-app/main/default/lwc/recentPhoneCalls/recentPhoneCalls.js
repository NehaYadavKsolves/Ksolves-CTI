import { LightningElement, api } from 'lwc';

export default class RecentPhoneCalls extends LightningElement {
    @api isRecentCallsVisible = false;
    contacts=['Dummy'];
}