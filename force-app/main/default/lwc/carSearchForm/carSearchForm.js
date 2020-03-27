import { LightningElement, track, wire } from 'lwc';
import getCarTypes from '@salesforce/apex/CarSearchFormController.getCarTypes';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class CarSearchForm extends NavigationMixin(LightningElement) {

    @track carTypes;

    @wire(getCarTypes)
    wiredCarTypes({ data, error }) {
        if (data) {
            this.carTypes = [{ label: 'All Types', value: '' }];
            data.forEach(element => {
                const carType = {};
                carType.label = element.Name;
                carType.value = element.Id;
                this.carTypes.push(carType);
            });
        } else if (error) {
            this.showToastEvent('Error', error.body.message, 'error');
        }
    }

    showToastEvent(title, message, variant) {
        const toastEvent = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(toastEvent);
    }

    handleCarTypeChange(event) {
        const carTypeId = event.detail.value;
        const carTypeSelectChangeEvent = new CustomEvent('cartypeselect', { detail: carTypeId });
        this.dispatchEvent(carTypeSelectChangeEvent);
    }

    createNewCarType() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Car_Type__c',
                actionName: 'new'
            }
        });
    }

}