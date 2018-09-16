/**
 * Mobile Web Development
 * Final Assignment
 *
 * File Name: global.js
 *
 * Revision History:
 *       Brett Hall and Singithi Kandage, 2018-03-15 : Created
 */


function radListView_click(){
    showListView();
}

function radMapView_click() {
    showMapView();
}

function radMyListView_click(){
    showMyListView();
}

function radMyMapView_click(){
    showVendorMapView();
}

function chxIsVendor_Checked(){
    toggleVendorDetails();
}

function btnRegister_click(){
    userRegisters();
}

function lnkRegister_click(){
    navigateToRegister();
}


function btnSignIn_click(){
    userSignIn();
}

function btnSignOut_click(){
    navigateToSignIn();
}

function btnSaveListItem_click(){
    saveListItem();
}

function pageSignIn_pageshow(){
    //Clear local storage on sign-in page
    localStorage.clear();
}

function pageRegister_pageshow(){
    loadProvinceSelectLists();
}

function btnAddSave_click() {
    addVendorProduct();
}

function btnModifyUpdate_click(){
    updateSelectedVendorProduct()
}

function btnModifyDelete_click(){
    deleteVendorProduct();
}

function pageAccount_pageshow(){
    getAccountInformation();
}

function pageProducts_pageshow(){
    getAllVendorProducts();
}

function pageVendors_pageshow(){
    getAllVendors();
}

function pageMyFarm_pageshow(){
    getAllVendorProductsByVendor();
}

function pageAddProduct_pageshow(){
    loadProductSelectLists();
}

function pageModifyProduct_pageshow(){
    loadProductSelectLists();
    getSelectedProduct();
}

function pageShoppingList_pageshow(){
    getAllShoppingListItems();
}

function btnConfirmDelete_click(){
    //Delete item
    deleteListItem();
    //refreshes list
    getAllShoppingListItems();
}

function btnCancelDelete_click(){
    //refreshes list
    getAllShoppingListItems();
}

function init() {

    //PageShow events
    $("#pageSignIn").on("pageshow", pageSignIn_pageshow);
    $("#pageRegister").on("pageshow", pageRegister_pageshow);
    $("#pageAccount").on("pageshow", pageAccount_pageshow);
    $("#pageProducts").on("pageshow", pageProducts_pageshow);
    $("#pageVendors").on("pageshow", pageVendors_pageshow);
    $("#pageMyFarm").on("pageshow", pageMyFarm_pageshow);
    $("#pageAddProduct").on("pageshow", pageAddProduct_pageshow);
    $("#pageModifyProduct").on("pageshow", pageModifyProduct_pageshow);
    $("#pageShoppingList").on("pageshow", pageShoppingList_pageshow);


    /*  REGISTER PAGE EVENT LISTENERS */
    //Hide Vendor Details div on Register page
    $("#btnRegister").on("click", btnRegister_click);
    $("#divVendorDetails").hide();
    //Show Vendor Details on click
    $("#chxIsVendor").on("click", chxIsVendor_Checked);


    /*  SIGN IN PAGE EVENT LISTENERS */
    //Sign-In Button
    $("#lnkRegister").on("click", lnkRegister_click);
    $("#btnSubmit").on("click", btnSignIn_click);


    /*  ACCOUNT PAGE EVENT LISTENERS */
    //Sign Out Button
    $("#btnSignOut").on("click", btnSignOut_click);


    /*  PRODUCTS PAGE EVENT LISTENERS */
    //Hide List View on load, and show Map View (on Products page)
    $("#lstLocalProducts").hide();
    showMapView();
    $("#radListView").on("click", radListView_click);
    $("#radMapView").on("click", radMapView_click);
    //Check Local Product Detail popup is open
    if ($.mobile.activePage.find("#dlgProductDetail").is(":visible")){
        dlgVendorProductDetail_onOpen();
    }
    //If "Save to Shopping List" button is clicked
    $("#btnSaveListItem").on("click", btnSaveListItem_click);


    /*  VENDOR PAGE EVENT LISTENERS */
    //Check Local Product Detail popup is open
    if ($.mobile.activePage.find("#dlgVendorDetail").is(":visible")){
        dlgVendorProductDetail_onOpen();
    }

    /*  ADD PRODUCT PAGE EVENT LISTENERS */
    $("#btnAddSave").on("click", btnAddSave_click);

    /*  MODIFY PRODUCT PAGE EVENT LISTENERS */
    $("#btnModifyUpdate").on("click", btnModifyUpdate_click);
    $("#btnModifyDelete").on("click", btnModifyDelete_click);

    /*  MY FARM PAGE EVENT LISTENERS */
    //Hide List View on load, and show Map View
    $("#lstMyLocalProducts").show();
    $("#my-map-canvas").hide();
    //Functionality for Map View and List View on MyFarm page
    $("#radMyListView").on("click", radMyListView_click);
    $("#radMyMapView").on("click", radMyMapView_click);


    /*  SHOPPING LIST PAGE EVENT LISTENERS */
    $("#btnConfirmDelete").on("click", btnConfirmDelete_click);
    $("#btnCancelDelete").on("click", btnCancelDelete_click);
}

function initDB(){
    try {
        console.info("Creating Database ...");
        DB.createDatabase();
        if (db) {
            console.info("Dropping tables ...");
            DB.dropAllTables();

            console.info("Creating tables ...");
            DB.createTables();
            console.info("Populating tables with dummy data...");
            DB.populateTables();
        }
        else{
            console.error("Error: Cannot create tables : Database not available");
        }
    } catch (e) {
        console.error("Error: (Fatal) Error in initDB(). Can not proceed. " + e.message);
    }
}

$(document).ready(function () {
    initDB();
    init();
});




