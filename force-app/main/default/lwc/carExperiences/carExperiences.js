import { LightningElement, api, track } from 'lwc';
import getExperiences from '@salesforce/apex/CarExperienceController.getExperiences';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class CarExperiences extends NavigationMixin(LightningElement) {
    privateCarId;
    @track carExperiences;
    connectedCallback() {
        this.getExperiencesFromController();
    }

    @api
    get carId() {
        return this.privateCarId;
    }

    set carId(value) {
        this.privateCarId = value;
        this.getExperiencesFromController();
    }

    @api
    getExperiencesFromController() {
        getExperiences({ carId: this.privateCarId }).then(response => {
            console.log(response);
            this.carExperiences = response
        }).catch(error => {
            this.showToast('error', error.body.message, 'Error');
        });
    }

    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }

    userClickHandler(event) {
        const userId = event.target.getAttribute('data-userid');
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: userId,
                objectApiName: 'User',
                actionName: 'view'
            }
        });
    }

    get hasExperiences() {
        if (this.carExperiences && this.carExperiences.length != 0) {
            //alert(this.carExperiences.length);
            return true;
        }
        return false;
    }
}