public with sharing class CarSearchResultController {
    
    @AuraEnabled(Cacheable=true)
    public static List<Car__c> getCars(String carTypeId){
        if(String.isEmpty(carTypeId)){
            return [SELECT Id, Name, Contact__r.Name, Geolocation__latitude__s, Geolocation__longitude__s, Picture__c FROM Car__c WHERE Available_For_Rent__c = true];
        }else{
            return [SELECT Id, Name, Contact__r.Name, Geolocation__latitude__s, Geolocation__longitude__s, Picture__c FROM Car__c WHERE Available_For_Rent__c = true AND Car_Type__c = :carTypeId];
        }
    }
}
