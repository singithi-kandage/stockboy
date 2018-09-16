/**
 * Mobile Web Development
 * Final Assignment
 *
 * File Name: util.js
 *
 * Revision History:
 *       Brett Hall and Singithi Kandage, 2018-03-15 : Created
 */


function validate_frmSignIn(){
    var form = $("#frmSignIn");

    form.validate({
        rules: {
            txtUsername: {
                required: true
            },
            txtPassword: {
                required: true
            }
        },
        messages: {
            txtUsername: {
                required: "Username is required."
            },
            txtPassword: {
                required: "Password is required."
            }
        }
    });
    return form.valid();
}

function validate_frmRegister(){
    var form = $("#frmRegister");
    form.validate({
        rules: {
            txtRegUsername: {
                required: true,
                rangelength: [2, 30]
            },
            txtFirstName: {
                required: true,
                rangelength: [2, 30]
            },
            txtLastName: {
                required: true,
                rangelength: [2, 30]
            },
            txtEmail: {
                required: true,
                email: true
            },
            txtRegPassword: {
                required: true
            },
            txtPasswordConfirm: {
                required: true,
                equalTo: "#txtRegPassword"
            },
            datDOB: {
                required: true
            },
            txtLine1: {
                required: true
            },
            txtCity: {
                required: true
            },
            selProvince: {
                required: true
            },
            txtPostalCode: {
                required: true
            },
            txtVLine1: {
                required: true
            },
            txtVCity: {
                required: true
            },
            selVProvince: {
                required: true
            },
            txtVPostalCode: {
                required: true
            },
            txtBusinessName: {
                required: true,
                rangelength: [2, 30]
            }
        },
        messages: {
            txtRegUsername: {
                required: "Username is required.",
                rangelength: "First Name must be between 2-30 characters."
            },
            txtFirstName: {
                required: "First Name is required.",
                rangelength: "First Name must be between 2-30 characters."
            },
            txtLastName: {
                required: "Last Name is required.",
                rangelength: "Last Name must be between 2-30 characters."
            },
            txtEmail: {
                required: "Email is required.",
                email: "Not a valid email."
            },
            txtPassword: {
                required:  "Password is required."
            },
            txtPasswordConfirm: {
                required:  "Password Confirm is required.",
                equalTo: "Passwords don't match"
            },
            datDOB: {
                required: "Date of Birth is required."
            },
            txtLine1: {
                required: "Line 1 is required."
            },
            txtCity: {
                required: "City is required."
            },
            selProvince: {
                required: "Province is required."
            },
            txtPostalCode: {
                required: "Postal is required."
            },
            txtVLine1: {
                required: "Vendor Line 1 is required."
            },
            txtVCity: {
                required: "Vendor City is required."
            },
            selVProvince: {
                required: "Vendor Province is required."
            },
            txtVPostalCode: {
                required: "Vendor Postal Code is required."
            },
            txtBusinessName: {
                required: "Business Name is required.",
                rangelength: "Business Name must be between 2-30 characters."
            }
        }
    });
    return form.valid();
}


function validate_frmAddVendorProduct(){
    var form = $("#frmAddVendorProduct");
    form.validate({
        rules: {
            txtAddQuantity: {
                required: true,
            },
            txtAddPrice: {
                required: true,
            }
        },
        messages: {
            txtAddQuantity: {
                required: "Quantity is required."
            },
            txtAddPrice: {
                required: "Price is required."
            }
        }
    });
    return form.valid();
}

function validate_frmModifyVendorProduct(){
    var form = $("#frmModifyVendorProduct");
    form.validate({
        rules: {
            txtModifyQuantity: {
                required: true,
            },
            txtModifyPrice: {
                required: true,
            }
        },
        messages: {
            txtModifyQuantity: {
                required: "Quantity is required."
            },
            txtModifyPrice: {
                required: "Price is required."
            }
        }
    });
    return form.valid();
}


function setUserInfo(){

     var valid = false;
     var options = [$("#txtUsername").val()];

     function callback(tx,results){

         if(results.rows.length > 0){

             var row = results.rows.item(0);

             localStorage.setItem("username", row['username']);
             localStorage.setItem("userId", row['userId']);
             localStorage.setItem("isVendor", row['isVendor']);

             //set vendorId if user is vendor
             if(row['isVendor'] == "true") {
                 setVendorId(row['userId']);
             }
             else{
                 localStorage.removeItem('vendorId');
             }
         }
         else{
            alert("We could not find your username/password. Have you signed up for an account?.");
         }
     }
     User.selectOneUser(options,callback);

     if($("#txtUsername").val() == localStorage.getItem("username"))
     {
         valid = true;
     }

     return valid;
 }


function setVendorId(userId){

    var options = [userId];

    function callback(tx,results){

        if(results.rows.length > 0){

            var row = results.rows.item(0);

            localStorage.setItem("vendorId", row['vendorId']);
        }
        else{
            alert("User does not exist.");
        }
    }
    Vendor.selectOneVendorByUser(options, callback);
}

 function getUserInfo(){

    var userId = localStorage.getItem("userId");
    var isVendor = localStorage.getItem("isVendor");

    var options = [userId];

     function callback(tx,results){

         if(results.rows.length > 0){

             var row = results.rows.item(0);

            //Print data to console
             console.log("User ID: " + row['userId']);
             console.log("User ID: " + row['username']);
             console.log("User ID: " + row['firstName']);
             console.log("User ID: " + row['lastName']);
             console.log("User ID: " + row['isVendor']);

             //Set Account Button text to name of user
             $(".account-btn").html(row['firstName'] + " " + row['lastName']);
         }
         else{
             alert("User does not exist.");
         }
     }
    User.selectUserById(options,callback);

    if(isVendor == "false"){

        $('.farm-page-link').click(function(e) {
            e.preventDefault();
        });
    }
}



 function navigateToMain(){

    //Redirect to Home Page
     $.mobile.changePage("#pageHome", {transition: 'none'});

     //Prepare Pages with necessary information
    getUserInfo();
 }


function navigateToSignIn(){

    //Redirect to Sign In Page
    $.mobile.changePage("#pageSignIn", {transition: 'none'});
}


function navigateToRegister(){

    //Redirect to Register Page
    $.mobile.changePage("#pageRegister", {transition: 'none'});
}







