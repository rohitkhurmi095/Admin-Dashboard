//=======================
// ENUM for DbOperations
//========================
//FOR DATABASE OPERATIONS
//Enum allows a developer to 'DEFINE SET OF NAMED CONSTANTS'

//Create Enum for Database Operations
//Eg- if we are using same button for add/update operations
//define DbOperation.method in the specific case (create/update)
//EnumBName =DbOpeartions  
//method = create update delete view

export enum DbOperations{
    create = 1,
    update = 2,
    delete = 3,
    view = 4
}