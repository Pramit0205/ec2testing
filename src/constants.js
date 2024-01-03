let constants = {
    "SUCCESS": false,
    "ERROR": true,
    "HTTP_CREATED": 201,//CREATED
    "HTTP_SUCCESS": 200, // Success
    "HTTP_BADREQUEST": 400,
    "HTTP_NOT_FOUND": 404, // Not Found
    "HTTP_UNAUTHORIZED": 401,
    "HTTP_SERVER_ERROR": 500, // Server Error
    "is_debug": 1,
    "DEBUG_TYPE": "database", // email, database/ both
}
let messages = {

    "USER": {
        "SUCCESS": "User added successfully.",
        "WRONGUSERNAME": "Please add any valid mobule nuber or email.",
        "FAILURE": "Some error occured while adding user.",
        "DOESNOTMATCH": "Old Password is incorrect.",
        "ALREADYEXISTEMAIL": "Try another email this is already in use.",
        "ALREADYEXISTMOBILE": "Try another mobile this is already in use",
        "DOESNOTEXIST": "Try another userId this user Does not Exist",
        "INVALIDUSER": "Invalid user Id",
        "FETCHEDSUCCESS": "User fetched successfully",
        "FETCHEDFAILURE": "Some error occured while fetching user",
        "UPDATEDSUCCESS": "User updated successfully",
        "UPDATEDFAILURE": "Some error occured while updating user",
        "DELETEDSUCCESS": "User deleted successfully",
        "DELETEDFAILURE": "Some error occured while deleting user",
        "LOGINFAILED": "Username or password is incorrect",
        "LOGINSUCCESS": "Login successfully",
        "NOTALLOWED": "Your account is not activated contact admin to activate"
    },
}
module.exports = {
    constants,
    messages
}