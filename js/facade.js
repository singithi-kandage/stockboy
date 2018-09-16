/**
 * Mobile Web Development
 * Final Assignment
 *
 * File Name: facade.js
 *
 * Revision History:
 *       Brett Hall and Singithi Kandage, 2018-04-07 : Created
 */


function showListView(){
    //Code for displaying list view of each saved product
    $("#lstLocalProducts").show();
    $("#map-canvas").hide();
}

function showMyListView(){
    //Code for displaying list view of each saved product on MyFarm page
    $("#lstMyLocalProducts").show();
    $("#my-map-canvas").hide();
}

function toggleVendorDetails(){
    if($("#chxIsVendor").is(":checked"))
    {
        $("#divVendorDetails").show();
    }
    else
    {
        $("#divVendorDetails").hide();
    }
}

function userSignIn(){

    //validate form
    if(validate_frmSignIn()){
        if(setUserInfo()){
            navigateToMain();
        }
    }
    else{
        console.log("Validation failed.");
    }
}

function setUserId(){

    var username =  $("#txtRegUsername").val();
    var options = [username];

    function callBack(tx, results) {

        var row = results.rows.item(0);

        //Assign userId value
        localStorage.setItem('newUserId', row['userId']);
    }
    User.selectOneUser(options,callBack);
}

function userRegisters(){

    //validate form
    if(validate_frmRegister()){

        var username = $("#txtRegUsername").val();
        var email = $("#txtEmail").val();
        var password = $("#txtRegPassword").val();
        var firstName = $("#txtFirstName").val();
        var lastName = $("#txtLastName").val();

        var date = new Date($("#datDOB").val());
        var birthYear = date.getFullYear();
        var birthMonth = date.getMonth();
        var birthDay = date.getDay();
        var line1 = $("#txtLine1").val();
        var city = $("#txtCity").val();
        var province = $("#selProvince").val();
        var postalCode = $("#txtPostalCode").val();
        var isVendor = $("#chxIsVendor").prop('checked');

        var options = [username, email, password, firstName, lastName, birthYear, birthMonth, birthDay, line1, province, city, postalCode, isVendor];

        //Insert new User
        function callBack(tx, results) {
            console.log("New user added.");
            setUserId();
        }
        User.insert(options, callBack);

        if(isVendor == true)
        {
            addNewVendor();
        }
        else{
            $.mobile.changePage("#pageSignIn", {transition: 'none'});
        }

    }else{
        console.log("Validation failed.")

        $("#btnRegister").click(function(e) {
            e.preventDefault();
        });
    }

}

function addNewVendor(){

    var userId = localStorage.getItem('newUserId');

    if(userId != "")
    {
        //Business field values
        var businessName = $("#txtBusinessName").val();
        var vLine1 = $("#txtVLine1").val();
        var vTown = $("#txtVTown").val();
        var vProvince = $("#selVProvince").val();
        var vPostalCode = $("#txtVPostalCode").val();
        var longitude  = null;
        var latitude = null;
        var vPhone = $("#txtVPhone").val();
        var vEmail = $("#txtVEmail").val();

        var options = [userId, businessName, vLine1, vTown, vProvince, vPostalCode, longitude, latitude, vPhone, vEmail];

        //Insert new Vendor
        function callBack() {
            console.log("New vendor added");
            $.mobile.changePage("#pageSignIn", {transition: 'none'});
        }
        Vendor.insert(options, callBack);
    }
    else{
        alert("No userId.");
    }
}

function loadProvinceSelectLists(){

    var options = [];

    function callback(tx, results){
        var htmlCode = "";

        for(var i = 0; i < results.rows.length; i++){
            var row = results.rows.item(i);
            htmlCode += "<option value='"+ row['provinceCode'] +"'>" + row['name'] +"</option>";
        }

        $("#selVProvince").append(htmlCode);
        $("#selProvince").append(htmlCode);

        $("#selVProvince").val(9).selectmenu("refresh");
        $("#selProvince").val(9).selectmenu("refresh");
    }
    Province.selectAllProvinces(options, callback);
}


function loadProductSelectLists(){

    var options = [];

    function callback(tx, results){
        var htmlCode = "";

        for(var i = 0; i < results.rows.length; i++){
            var row = results.rows.item(i);
            htmlCode += "<option value='"+ row['productId'] +"'>" + row['name'] +"</option>";
        }

        $("#selAddProduct").append(htmlCode);
        $("#selModifyProduct").append(htmlCode);

        $("#selAddProduct").val(1).selectmenu("refresh");
    }
    Product.selectAllProducts(options, callback);

}

function dlgVendorDetail_onOpen(){

    var vendorId  = localStorage.getItem('vendorIdSelected');
    var options = [vendorId];

    function callBack(tx, results) {
        var row = results.rows.item(0);

        $("#dlg-vd-VendorName").html(row['name']);
        $("#dlg-vd-VendorAddress").html(row['address']);
        $("#dlg-vd-VendorTown").html(row['town']);
        $("#dlg-vd-VendorProvince").html(row['province']);
        $("#dlg-vd-VendorPostalCode").html(row['postalCode']);

        if(row['phone'] != "")
        {
            $("#dlg-vd-VendorPhone").html(row['phone']);
        }
        if(row['email'] != "")
        {
            $("#dlg-vd-VendorEmail").html(row['email']);
        }
    }
    Vendor.selectOneVendor(options, callBack);
}

function getAllVendors(){

    var options = [];

    function callBack(tx, results) {

        var htmlcode = "";

        for (var i = 0; i < results.rows.length; i++) {
            var row = results.rows.item(i);

            htmlcode +=  "<li><a href='#dlgVendorDetail' data-rel='popup' data-position-to='window' data-transition='pop' data-row-id=" + row['vendorId'] + ">" +
                "<img src='img/vegetable.png' class='list-icon'>" +
                "<h3>" + row['name']+ "</h3>" +
                "<p>" + row['town'] + "</p>" +
                "</a></li>";
        }

        var list = $("#lstAllVendors");
        list = list.html(htmlcode);
        list.listview("refresh"); //important

        $("#lstAllVendors a").on("click", clickHandler);

        function clickHandler() {
            localStorage.setItem("vendorIdSelected", $(this).attr("data-row-id"));
            dlgVendorDetail_onOpen();
        }
    }
    Vendor.selectAllVendors(options, callBack);
}


function dlgVendorProductDetail_onOpen(){

    var vendorProductId  = localStorage.getItem('vendorProductId');
    var options = [vendorProductId];

    function callBack(tx, results) {
        var row = results.rows.item(0);
        $("#dlg-pd-productName").html(row['name']);
        $("#dlg-pd-productPrice").html("$" + row['price'] + " / " + row['metricCode']);

        if(row['description'] != "null")
        {
            $("#dlg-pd-productDescription").html(row['description']);
        }
        $("#dlg-pd-productVendor").html(row['vendor']);
    }
    VendorProduct.selectOneVendorProduct(options,callBack);
}


function getAllVendorProducts(){
    var options = [];

    function callBack(tx, results) {

        var htmlcode = "";

        for (var i = 0; i < results.rows.length; i++) {
            var row = results.rows.item(i);

            htmlcode +=  "<li><a href='#dlgProductDetail' data-rel='popup' data-position-to='window' data-transition='pop' data-row-id="+ row['vendorProductId'] + ">" +
                "<img src='img/vegetable.png' class='list-icon'>" +
                "<h3>" + row['name']+ "</h3>" +
                "<p>" + row['vendor'] + "</p>" +
                "<p>$" + row['price'] + " / " + row['metricCode'] + "</p>" +
                "</a></li>";
        }

        var list = $("#lstLocalProducts");
        list = list.html(htmlcode);
        list.listview("refresh"); //important

        $("#lstLocalProducts a").on("click", clickHandler);

        function clickHandler() {
            localStorage.setItem("vendorProductId", $(this).attr("data-row-id"));
            dlgVendorProductDetail_onOpen();
        }
    }
    VendorProduct.selectAllProducts(options,callBack);
}

function getAllVendorProductsByVendor(){
dlgVendorProductDetail_onOpen()
    var vendorID = localStorage.getItem("vendorId");
    var options = [vendorID];

    function callBack(tx, results) {

        var htmlcode = "";

        if(results.rows.length == 0){
            htmlcode +=  "<li><a href='#'>" +
                "<h3>Sorry, no results found.</h3>" +
                "<p>Press the 'Add a Product button' to get your page started.</p>" +
                "</a></li>";
        }

        for (var i = 0; i < results.rows.length; i++) {

            var row = results.rows.item(i);

            htmlcode +=  "<li><a href='#' data-row-id=" + row['vendorProductId'] + ">" +
                "<img src='img/vegetable.png' class='list-icon'>" +
                "<h3>" + row['name']+ "</h3>" +
                "<p>$" + row['price'] + " / " + row['metricCode'] + "</p>" +
                "</a></li>";
        }

        var list = $("#lstMyLocalProducts");
        list = list.html(htmlcode);
        list.listview("refresh"); //important

        $("#lstMyLocalProducts a").on("click", clickHandler);

        function clickHandler() {
            localStorage.setItem("vendorProductId", $(this).attr("data-row-id"));
            $.mobile.changePage("#pageModifyProduct", {transition: 'none'});
        }
    }
    VendorProduct.selectAllProductsByVendor(options,callBack);
}


function saveListItem(){

    var userId =  localStorage.getItem('userId');
    var vendorProductId  = localStorage.getItem('vendorProductId');
    var options = [userId, vendorProductId];

    function callBack(tx, results) {
        console.log("New item has been added to your shopping list.");
        alert("New item has been added to your shopping list.");
    }
    ShoppingList.insert(options, callBack);
}


function deleteListItem(){

    var id = localStorage.getItem("listItemId");

    var options = [id];

    function callBack(tx, results) {
        console.log("Item deleted.");
    }
    ShoppingList.delete(options, callBack);
}

function getAllShoppingListItems(){

    var userId = localStorage.getItem('userId');
    var options = [userId];

    function callBack(tx, results) {
        var htmlcode = "";

        if(results.rows.length == 0){
            htmlcode +=  "<li><a href='#'>" +
                "<h3>Sorry, no results found.</h3>" +
                "<p>Go back to the Products Page, select an item and click 'Save', to save an item.</p>" +
                "</a></li>";
        }

        for (var i = 0; i < results.rows.length; i++) {

            var row = results.rows.item(i);

            htmlcode += "<li>" +
                "<a href='#dlgShoppingListDetail' class='lnkListItemData' data-rel='popup' data-position-to='window' data-transition='pop' data-row-id=" + row['id'] + ">" +
                "<img src='img/vegetable.png' class='list-icon'>" +
                "<h3>" + row['name'] + "</h3>" +
                "<p>" + row['price'] +"</p>" +
                "<p>" + row['vendor'] + "</p>" +
                "</a>" +
                "<a href='#dlgDeleteProduct' class='lnkDeleteListItem' data-rel='popup' data-permissible='false'  data-position-to='window' data-transition='pop' data-row-id=" + row['id'] + "></a>" +
                "</li>";
        }

        var list = $("#lstShoppingList");
        list = list.html(htmlcode);
        list.listview("refresh"); //important

        $("#lstShoppingList a.lnkListItemData").on("click", lnkListItemData_click);
        $("#lstShoppingList a.lnkDeleteListItem").on("click", lnkDeleteListItem_click);

        function lnkListItemData_click() {
            localStorage.setItem("listItemId",$(this).attr("data-row-id"));
        }
        function lnkDeleteListItem_click() {
            localStorage.setItem("listItemId",$(this).attr("data-row-id"));
        }
    }
    ShoppingList.selectAllListItemsByUser(options, callBack);
};


function getAccountInformation(){

    var userId  = localStorage.getItem('userId');
    var options = [userId];

    function callBack(tx, results) {
        var row = results.rows.item(0);

        $("#accountUsername").html(row['username']);
        $("#accountFirstName").html(row['firstName']);
        $("#accountLastName").html(row['lastName']);
        $("#accountEmail").html(row['email']);
        $("#accountIsVendor").html(row['isVendor']);

        if(row['isVendor'] == "true")
        {
            getVendorInformation();
        }
    }
    User.selectUserById(options, callBack);
}


function getVendorInformation(){

    var vendorId  = localStorage.getItem('vendorId');
    var options = [vendorId];

    function callBack(tx, results) {

        var row = results.rows.item(0);

        var htmlcode = "";

        htmlcode += "<p>Business Name:" + row['name'] + "</p>";
        htmlcode += "<br/><p>Address:</p>";
        htmlcode += "<p>" + row['address'] + "</p>";
        htmlcode += "<p>" + row['town'] + "</p>";
        htmlcode += "<p>" + row['province'] + "</p>";
        htmlcode += "<p>" + row['postalCode'] + "</p><br/>";

        if(row['phone'] != "null")
        {
            htmlcode += "<p>Phone: " + row['phone'] + "</p>";
        }
        if(row['email'] != "null")
        {
            htmlcode += "<p>Email: " + row['email'] + "</p>";
        }

        $("#accountDetails").append(htmlcode);
    }
    Vendor.selectOneVendor(options, callBack());
}

function getSelectedProduct(){

   //Get selected Vendor Product object
    var vendorProductId  = localStorage.getItem('vendorProductId');
    var options = [vendorProductId];

    function callBack(tx, results) {
        var row = results.rows.item(0);

        $("#selModifyProduct").val(row['productId']).selectmenu("refresh");;
        $("#txtModifyQuantity").val(row['quantityOnHand']);
        $("#txtModifyPrice").val(row['price']);

        if(row['onSale'] == "true"){
            $("#chxModifyOnSale").prop('checked', true).checkboxradio("refresh");
        }
        else{
            $("#chxModifyOnSale").prop('checked', false).checkboxradio("refresh");
        }
    }
    VendorProduct.selectVendorProduct(options,callBack);
}

function addVendorProduct(){

    if(validate_frmAddVendorProduct()) {

        //Insert new vendorproduct
        var vendorId = localStorage.getItem('vendorId');
        var productId = $("#selAddProduct").val();
        var quantity = $("#txtAddQuantity").val();
        var price = $("#txtAddPrice").val();
        var onSale = $("#chxAddOnSale").prop("checked");

        var options = [vendorId, productId, quantity, price, onSale];

        function callBack() {
            console.log("New product added.");
        }
        VendorProduct.insert(options, callBack());

        //Redirect to myFarm
        $.mobile.changePage("#pageMyFarm", {transition: 'none'});
    }
    else{
        console.log("Add Product Validation failed.")
    }
}

function updateSelectedVendorProduct(){

    if(validate_frmModifyVendorProduct()) {

        //Update new vendorproduct
        var vendorProductId = localStorage.getItem('vendorProductId');
        var vendorId = localStorage.getItem('vendorId');
        var productId = $("#selModifyProduct").val();
        var quantity = $("#txtModifyQuantity").val();
        var price = $("#txtModifyPrice").val();
        var onSale = $("#chxModifyOnSale").prop("checked");

        var options = [vendorId, productId, quantity, price, onSale, vendorProductId];

        function callBack() {
            console.log("Product updated.");

            //Redirect to myFarm
            $.mobile.changePage("#pageMyFarm", {transition: 'none'});
        }
        VendorProduct.update(options, callBack);

    }
    else{
        console.log("Modify Product Validation failed.")
    }
}

function deleteVendorProduct(){

    //1. Get vendorProductId
    var vendorProductId  = localStorage.getItem('vendorProductId');

    var options = [vendorProductId];

    function callBack() {
        console.log("Product deleted.");

        //Redirect to myFarm
        $.mobile.changePage("#pageMyFarm", {transition: 'none'});

    }
    VendorProduct.delete(options, callBack);
}