import { LightningElement, track, wire } from 'lwc';
import LL from '@salesforce/resourceUrl/Leaflet';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CarLocation extends LightningElement {
    @track car;
    @wire(CurrentPageReference) pageRef;
    isLLLoaded = false;
    leafletMap = false;

    connectedCallback() {
        registerListener('carselect', this.callBackMethod, this);
    }

    callBackMethod(payload) {
        this.car = payload;
        if (this.isLLLoaded) {
            if (!this.leafletMap) {
                const map = this.template.querySelector('.map');
                if (map) {
                    this.leafletMap = L.map(map, { zoomControl: true }).setView([42.356045, -71.085650], 13);
                    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', { attribution: 'Tiles For Rent A Car' }).addTo(this.leafletMap);
                }
                if (this.car) {
                    if (this.car) {
                        const location = [this.car.Geolocation__Latitude__s, this.car.Geolocation__Longitude__s];

                        const leafletMarker = L.marker(location);
                        leafletMarker.addTo(this.leafletMap);
                        this.leafletMap.setView(location);
                    }
                }
            }
        }
    }

    renderedCallback() {
        if (!this.isLLLoaded) {
            Promise.all([
                loadStyle(this, LL + '/leaflet.css'),
                loadScript(this, LL + '/leaflet-src.js')
            ]).then(response => {
                this.isLLLoaded = true;
            }).catch(error => {
                this.showToast('Error', error.body.message, 'error');
            });
        }
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }

    get hasCar() {
        if (this.car) {
            return 'slds-is-expanded';
        }
        return 'slds-is-collapsed';
    }

}