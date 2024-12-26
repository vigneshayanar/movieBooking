public with sharing class Transactioncontroller {
    @AuraEnabled
    public static void createTransaction(
        String showtime,
        String patron,
        Integer nooftickets,
        String email,
        String tel
    ) {
        try {
            // Query Movie Showing by Name
            Movie_Showing__c movieShowing = [
                SELECT Id
                FROM Movie_Showing__c
                WHERE Name = :showtime
                LIMIT 1
            ];
            
            // Query Patron by Name
            Patrons__c patronRecord = [
                SELECT Id
                FROM Patrons__c
                WHERE Name = :patron
                LIMIT 1
            ];

            // Create a new Transaction
            Transaction__c tnx = new Transaction__c();
            tnx.Movie_Showing__c = movieShowing.Id;
            tnx.Patron__c = patronRecord.Id;
            tnx.Number_of_tickets__c = nooftickets;
            tnx.Email_for_Communcation__c = email;
            tnx.Mobile_Number__c = tel;
            tnx.Approval_Status__c='Pending';

            // Insert Transaction
            insert tnx;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
