//=================
// BASE API PATH 
//=================
//BASE API URL is kept here
//use static keword => access directly as className.BASE_API_URL;
//dont need to create class instance

//NOTE:
//This url can also be kept in environments - production,development depending upon the use case 
//but here we need to specify if we want to use that url for production mode

export class Global{

    //Live Server URL
    public static BASE_API_PATH = "http://sahosoftweb.com/api/";

    
    //Base images path: Image Folder Path
    //images gets stored in this folder
    public static BASE_IMAGES_PATH = "http://sahosoftweb.com/images";

    //user images path: Users Images Folder Path
    //user related images gets stored in this folder
   public static BASE_USER_IMAGES_PATH = "http://sahosoftweb.com/users";
}
