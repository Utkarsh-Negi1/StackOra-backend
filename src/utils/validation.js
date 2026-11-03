// In this file i can do all the types of validation in the data

const validator = require('validator')

const validateSignUpData =(req)=>{
    const {firstName,
        lastName,
        emailId,
        password} = req.body;
        //validations-->
        // FIX 1: only firstName is required in the schema (lastName is optional)
        if(!firstName){
            throw new Error("name is not valid")
        }
        // FIX 2: compare the length directly, "!x.length < 4" is always true
        else if(firstName.length < 4 || firstName.length > 50){
            throw new Error("Naming should be in between 4-50 characters")
        }
        // FIX 3: check lastName only if it was sent (otherwise .length crashes)
        else if(lastName && lastName.length > 50){
            throw new Error("last name should be at most 50 characters")
        }
        // FIX 4: check emailId/password exist first, validator throws on undefined
        else if(!emailId || !validator.isEmail(emailId)){
            throw new Error("please enter a valid email")
        }
        // else if(!password || !validator.isStrongPassword(password)){
        //     throw new Error("please enter a strong password")
        // }
};// extract this from req body

const validateEditProfileData = (req) => {
    // check allowed edit fields
    const  allowedEditFields = ["firstName",
         "lastName" ,
         "emailId",
         "about",
         "skills",
         "gender" ,
        "photoUrl",
        "age"]
 // i will loop through this req body and i will check if all this things are matching the criteria or not
 const isEditAllowed = Object.keys(req.body).every((field)=>allowedEditFields.includes(field));
return isEditAllowed;
}

// Validation for the change password API
// Body: { currentPassword, newPassword }
const validatePasswordChangeData = (req) => {
    const { currentPassword, newPassword } = req.body;
 
    if (!currentPassword || !newPassword) {
        throw new Error("currentPassword and newPassword are required");
    }
    // validator throws if it gets anything other than a string
    if (typeof currentPassword !== "string" || typeof newPassword !== "string") {
        throw new Error("passwords must be strings");
    }
    if (!validator.isStrongPassword(newPassword)) {
        throw new Error(
            "new password is not strong (min 8 chars, with uppercase, lowercase, number and symbol)"
        );
    }
    if (currentPassword === newPassword) {
        throw new Error("new password must be different from the current password");
    }
};

module.exports = {
    validateSignUpData,
    validateEditProfileData,
    validatePasswordChangeData

};






















// In this file i can do all the types of validation in the data

// const validator = require('validator')

// const validateSignUpData =(req)=>{
//     const {firstName,
//         lastName,
//         emailId,
//         password} = req.body;
//         //validations-->
//         if((!firstName) && (!lastName)){
//             throw new Error("name is not valid")
//         }
//         else if((!firstName.length)<4 && (!lastName.length)>50){
//             throw new Error("Naming should be in between 4-50 charactersS")
//         }
//         else if(!validator.isEmail(emailId)){
//             throw new Error("please enter a valid email")
//         }
//         else if(!validator.isStrongPassword(password)){
//             throw new Error("please enter a strong password")
//         }
// };// extract this from req body

// module.exports = {
//     validateSignUpData,
// };