import { LightningElement, track } from 'lwc';

export default class ConfigurationAreas extends LightningElement {
    
    @track isOption1acvtive = true;
    @track isOption2acvtive = false;
    @track isOption3cavtive = false;
    @track isOption4acvtive = false;


   get a(){
        return  `slds-nav-vertical__item   ${ this.isOption1acvtive ? 'slds-is-active': ''}` ;
    }
   
    get b(){
        return  `slds-nav-vertical__item   ${ this.isOption2acvtive ? 'slds-is-active': ''}` ;
    }

    get c(){
        return  `slds-nav-vertical__item   ${ this.isOption3acvtive ? 'slds-is-active': ''}` ;
    }

    get d(){
        return  `slds-nav-vertical__item   ${ this.isOption4acvtive ? 'slds-is-active': ''}` ;
    }
   
    handleOption1(){
        this.isOption1acvtive = true;
        this.isOption2acvtive = false;
        this.isOption3acvtive = false;
        this.isOption4acvtive = false;

    }
    handleOption2(){
        this.isOption1acvtive = false;
        this.isOption2acvtive = true;
        this.isOption3acvtive = false;
        this.isOption4acvtive = false;

    } 
    handleOption3(){
        this.isOption1acvtive = false;
        this.isOption2acvtive = false;
        this.isOption3acvtive = true;
        this.isOption4acvtive = false;

    } 

    handleOption4(){
        this.isOption1acvtive = false;
        this.isOption2acvtive = false;
        this.isOption3acvtive = false;
        this.isOption4acvtive = true;
    } 


    
}