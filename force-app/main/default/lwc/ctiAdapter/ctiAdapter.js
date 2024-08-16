import { LightningElement } from 'lwc';
export default class CtiAdapter extends LightningElement {
    isLoading = true;
    isIncoming = false;

    connectedCallback() {
        setTimeout(() => {
            this.isLoading = false;
            this.isIncoming = true;
        }, 3000);
    }
}