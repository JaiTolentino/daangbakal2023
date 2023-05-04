function checkSpecialChars(str) {
    const specialChars = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(str);
}


function containsNumbers(str) {
    return /[0-9]/.test(str)
}

function isLowerCase(str) {
    return str.toLowerCase() === str;

  }

function isUpperCase(str) {
return str.toUpperCase() === str;
}
function checkPassword(password) {
    if (checkSpecialChars(password) === true) {
        if(containsNumbers(password) === true) {
            if(isUpperCase(password) === true) {
                if(isLowerCase(password) === true) {
                    console.log("Password Passed the checkPassword");
                    return password;
                } else {
                    console.log('Password doesnt have uppercase letters')
                }
            }else {
                console.log('Password doesnt have lowercase letters')
            }
        } else {
            console.log('Password doesnt contain Numbers');
        }
    }else {
        console.log('Password doesnt contain Special Characters');
        
    }
}

function text(phoneNumber){
    phoneNumber = phoneNumber.replace("0", "+63")
    return phoneNumber;
}
