public with sharing class PathConfingController {
    @AuraEnabled(cacheable=true)
    public static Sobject getPath_values(String objectApiName) {
        
      return  [select Sobject__c,field__c,values__c from Path_configuration__mdt where Sobject__c = :objectApiName limit 1]; 

    }
    @AuraEnabled(cacheable=true)
    public static String getcurrentpicklistvalues(string fieldName,string objectApiName,Id recordId){
        String query = 'SELECT ' + fieldName + ' FROM ' + objectApiName + ' WHERE Id =:recordId';
        sobject record= Database.query(query);

        if(record !=null){
            return String.valueOf(record.get(fieldName));
        }
        return null;
    }
}