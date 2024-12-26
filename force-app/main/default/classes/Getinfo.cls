public with sharing class Getinfo {
    @AuraEnabled(cacheable=true)
    public static List<Theatres__c> getTheaters(){
        return[select Id,Name from Theatres__c];
    }

    @AuraEnabled(cacheable=true)
    public static List<Movie__c> getMovies(){
        return[select Name from Movie__c];
    }
    @AuraEnabled(cacheable=true)
    public static List<Movie_Showing__c> getMovieshowing(string theaterName,String movieName){
       
        return[select Name,Theatre_Name__c, Movie_Title__c, Price__c from Movie_Showing__c WHERE Theatre_Name__r.Name=:theaterName AND Movie_Title__r.Name =:movieName ];
    }
    @AuraEnabled(cacheable=true)
    public static list<Patrons__c> getPatron(){
        return[select Name from Patrons__c];
    }
}