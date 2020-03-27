import { LightningElement, api, track, wire } from 'lwc';
import getCars from '@salesforce/apex/CarSearchResultController.getCars';

export default class CarSearchResult extends LightningElement {
    @api carTypeId;
    @track cars;
    @track selectedCarId;

    @wire(getCars, { carTypeId: '$carTypeId' })
    wiredCars({ data, error }) {
        if (data) {
            console.log(data);
            this.cars = data;
        } else if (error) {
            console.log(error)
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

    get carsFound() {
        if (this.cars) {
            return true;
        }
        return false;
    }

    carSelectHandler(event) {
        this.selectedCarId = event.detail;
    }
}