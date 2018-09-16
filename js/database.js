/*
database.js
    By: Brett Hall, Singithi Kandage
    Created: 4/19/2018
 */

var db;

/**
 * General purpose error handler
 * @param tx The transaction object
 * @param error The error object
 */
function errorHandler(tx, error) {
    console.error("SQL error: " + tx + " (" + error.errorCode + ") : " + error.message);
}

function successTransaction(){
    console.info("The transaction was completed successfully");
}


var DB = {
    //---CREATE DATABASE---
    createDatabase: function(){
        var dbName = "Stockboy Database";
        var version = "1.0";
        var displayName = "Stockboy DB";
        var size = 2 * 1024 * 1024;

        function successCreate(){
            console.info("Database created successfully");
        }
        db = openDatabase(dbName, version, displayName, size, successCreate);
    },

    //---CREATE TABLES---
    createTables: function(){
        function txFunction(tx){
            var createStatements = [];

            var category =
                "CREATE TABLE IF NOT EXISTS category" +
                "(" +
                "categoryId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," +
                "name nvarchar(255) NOT NULL" +
                ");";
            createStatements.push(category);

            var metric =
                "CREATE TABLE IF NOT EXISTS metric" +
                "(" +
                "metricCode varchar(3) NOT NULL PRIMARY KEY," +
                "fullName varchar(20) NOT NULL," +
                "CONSTRAINT metric_name_unique UNIQUE (fullName)" +
                ");";
            createStatements.push(metric);

            var product =
                "CREATE TABLE IF NOT EXISTS product" +
                "(" +
                "productId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," +
                "categoryId INTEGER NOT NULL," +
                "name nvarchar(255) NOT NULL," +
                "metricCode char(3) NOT NULL," +
                "description VARCHAR(255)," +
                "imageName VARCHAR(255)," +
                "FOREIGN KEY(categoryId) REFERENCES category(categoryId)," +
                "FOREIGN KEY(metricCode) REFERENCES metric(metricCode)" +
                ");";
            createStatements.push(product);

            var province =
                "CREATE TABLE IF NOT EXISTS province" +
                "(" +
                "provinceCode nchar(2) NOT NULL PRIMARY KEY," +
                "name varchar(50) NOT NULL" +
                ");";
            createStatements.push(province);

            var vendor =
                "CREATE TABLE IF NOT EXISTS vendor" +
                "(" +
                "vendorId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," +
                "userId INTEGER NOT NULL," +
                "name varchar(50) NOT NULL," +
                "address varchar(50) NOT NULL," +
                "town varchar(50) NOT NULL," +
                "provinceCode nchar(2) NOT NULL," +
                "postalCode varchar(10) NULL," +
                "longitude INTEGER," +
                "latitude INTEGER," +
                "phone varchar(50)," +
                "email varchar(250)," +
                "FOREIGN KEY (provinceCode) REFERENCES province(provinceCode)," +
                "FOREIGN KEY (userId) REFERENCES user(userId)" +
                ");";
            createStatements.push(vendor);

            var hours =
                "CREATE TABLE IF NOT EXISTS hours" +
                "(" +
                "vendorId INTEGER NOT NULL," +
                "weekdayId INTEGER NOT NULL," +
                "startTime TIME," +
                "endTime TIME," +
                "PRIMARY KEY (vendorId, weekdayId)," +
                "FOREIGN KEY (vendorId) REFERENCES vendor(vendorId)" +
                ");";
            createStatements.push(hours);

            var vendorproduct =
                "CREATE TABLE IF NOT EXISTS vendorproduct" +
                "(" +
                "vendorProductId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," +
                "vendorId INTEGER NOT NULL," +
                "productId INTEGER NOT NULL," +
                "quantityOnHand INTEGER," +
                "price decimal NOT NULL," +
                "onSale VARCHAR(1), " +
                "FOREIGN KEY (vendorId) REFERENCES vendor(vendorId)," +
                "FOREIGN KEY (productId) REFERENCES product(productId)" +
                ");";
            createStatements.push(vendorproduct);

            var user =
                "CREATE TABLE IF NOT EXISTS user" +
                "(" +
                "userId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," +
                "username VARCHAR(50) NOT NULL UNIQUE," +
                "email VARCHAR(50) NOT NULL," +
                "password VARCHAR(50) NOT NULL," +
                "firstName VARCHAR(25) NOT NULL," +
                "lastName VARCHAR(25) NOT NULL," +
                "birthYear CHAR(4) NOT NULL," +
                "birthMonth CHAR(2) NOT NULL," +
                "birthDay CHAR(2) NOT NULL," +
                "address VARCHAR(50) NOT NULL," +
                "provinceCode NCHAR(2) NOT NULL," +
                "city VARCHAR(25) NOT NULL," +
                "postalCode char(7) NOT NULL," +
                "isVendor boolean NOT NULL," +
                "FOREIGN KEY (provinceCode) REFERENCES province(provinceCode)" +
                ");";
            createStatements.push(user);

            var shoppinglist =
                "CREATE TABLE IF NOT EXISTS shoppingList" +
                "(" +
                "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
                "userId INTEGER NOT NULL, " +
                "vendorProductId INTEGER NOT NULL, " +
                "FOREIGN KEY (userId) REFERENCES user(userId) " +
                "FOREIGN KEY (vendorProductId) REFERENCES vendorproduct(vendorProductId)" +
                ");";
            createStatements.push(shoppinglist);

            var options = [];

            function successCreate(){
                console.info("Successfully created tables");
            }
            for (var i = 0; i < createStatements.length; i++){
                tx.executeSql(createStatements[i], options, successCreate, errorHandler);
            }
        }
        db.transaction(txFunction, errorHandler, successTransaction);
    },

    //---POPULATE TABLES---
    populateTables: function(){
        function txFunction(tx){
            var insertStatements = [];
            var options = [[],[],[],[],[],[],[],[]];

            var hours = "INSERT OR IGNORE INTO hours(vendorId, weekdayId, startTime, endTime) VALUES(?,?,?,?);";

            options[0][0] = [1, 1, '8:00', '15:00'];
            options[0][1] = [1, 2, '8:00', '15:00'];
            options[0][2] = [1, 3, '8:00', '15:00'];
            options[0][3] = [1, 4, '8:00', '15:00'];
            options[0][4] = [1, 5, '7:00', '14:00'];
            options[0][5] = [2, 0, '8:00', '21:00'];
            options[0][6] = [2, 1, '8:00', '21:00'];
            options[0][7] = [2, 2, '8:00', '21:00'];
            options[0][8] = [2, 3, '8:00', '21:00'];
            options[0][9] = [2, 4, '8:00', '21:00'];
            options[0][10] = [2, 5, '8:00', '21:00'];
            options[0][11] = [2, 6, '9:00', '19:00'];
            options[0][12] = [4, 0, '10:30', '19:00'];
            options[0][13] = [4, 1, '10:30', '19:00'];
            options[0][14] = [4, 2, '10:30', '19:00'];
            options[0][15] = [4, 3, '10:30', '19:00'];
            options[0][16] = [4, 4, '10:30', '19:00'];
            options[0][17] = [4, 5, '10:00', '17:00'];
            options[0][18] = [5, 3, '7:00', '15:30'];
            options[0][19] = [5, 5, '7:00', '15:30'];
            options[0][20] = [6, 4, '15:00', '18:00'];
            options[0][21] = [7, 4, '14:00', '19:00'];

            insertStatements.push(hours);


            var metric = "INSERT INTO metric(metricCode, fullName) VALUES(?,?);";
            options[1][0] = ['EA', 'Each'];
            options[1][1] = ['LB', 'Pounds'];
            options[1][2] = ['L', 'Litre'];
            options[1][3] = ['mL', 'Mililitres'];
            options[1][4] = ['doz', 'Dozen'];
            options[1][5] = ['bg', 'Bag'];
            options[1][6] = ['qt', 'Quart'];

            insertStatements.push(metric);

            var province = 'INSERT INTO province(provinceCode,name) VALUES(?,?);';
            options[2][0] = ['AB', 'Alberta'];
            options[2][1] = ['BC', 'British Columbia'];
            options[2][2] = ['MB', 'Manitoba'];
            options[2][3] = ['NB', 'New Brunswick'];
            options[2][4] = ['NL', 'Newfoundland and Labrador'];
            options[2][5] = ['NT', 'Northwest Territories'];
            options[2][6] = ['NS', 'Nova Scotia'];
            options[2][7] = ['NU', 'Nunavut'];
            options[2][8] = ['ON', 'Ontario'];
            options[2][9] = ['PE', 'Prince Edward Island'];
            options[2][10] = ['QC', 'Quebec'];
            options[2][11] = ['SK', 'Saskatchewan'];
            options[2][12] = ['YT', 'Yukon'];

            insertStatements.push(province);

            var vendors = "INSERT INTO vendor(userId,name,address,town,provinceCode,postalCode,latitude,longitude,phone,email) VALUES(?,?,?,?,?,?,?,?,?,?);";
            options[3][0] = [1,"Kitchener Market","300 King Street East","Kitchener","ON","N2G 2L3",43.448214,-80.483695,"519-741-2287","info@kitchenermarket.ca"];
            options[3][1] = [2,"Farm Boy","385 Fairway Rd S","Kitchener","ON","N2C 2N9",43.461783,-80.521892,"519-772-0587",null];
            options[3][2] = [3,"Bailey's Local Foods","16 William St W","Waterloo","ON","N2L 1J3",43.461857,-80.521956,"519-497-2350",null];
            options[3][3] = [4,"Legacy Greens","10 King St E","Waterloo","ON","N2G 2K6",43.450035,-80.488844,"519-760-2535","jordan@legacygreens.com"];
            options[3][4] = [5,"St Jacobs Farmers' Market","878 Weber St N","Woolwich","ON","N2J 4A9",43.512306,-80.556033,null,null];
            options[3][5] = [6,"The Sustainable Market","275 Erb Street East","Waterloo","ON","N2J 1N6",43.474084,-80.498620,null,null];
            options[3][6] = [7,"Snyder Heritage Farms","1213 Maple Bend Rd. RR#1","Breslau","ON","N0B 1M0",43.527863,-80.445324,null,null];

            insertStatements.push(vendors);

            var category = "INSERT INTO category(name) VALUES(?);";
            options[4][0] = ["Meat and Poultry"];
            options[4][1] = ["Cheese"];
            options[4][2] = ["Vegetables and Herbs"];
            options[4][3] = ["Fruit"];
            options[4][4] = ["Grains"];
            options[4][5] = ["Baked Goods"];

            insertStatements.push(category);

            var product = "INSERT INTO product(categoryId,name,metricCode,description,imageName) VALUES(?,?,?,?,?)";
            options[5][0] = [1, "Ground Beef", 'LB', null, "chop.png"];
            options[5][1] = [1, "Pork Sausage", 'LB', null, "sausage.png"];
            options[5][2] = [1, "Chicken Breast", 'LB', null, "chicken.png"];
            options[5][3] = [1, "Eggs", 'doz', null, "egg.png"];
            options[5][4] = [1, "Steak", 'LB', null, "chop.png"];
            options[5][5] = [2, "Mozzarella", 'LB', null, "cheese.png"];
            options[5][6] = [2, "Cheddar", 'LB', null, "cheese.png"];
            options[5][7] = [2, "Provolone", 'LB', null, "cheese.png"];
            options[5][8] = [2, "Feta", 'LB', null, "cheese.png"];
            options[5][9] = [2, "Blue Cheese", 'LB', null, "cheese.png"];
            options[5][10] = [3, "Lettuce", 'EA', null, "lettuce.png"];
            options[5][11] = [3, "Kale", 'EA', null, "lettuce.png"];
            options[5][12] = [3, "Spinach", 'EA', null, "lettuce.png"];
            options[5][13] = [3, "Carrot", 'LB', null, "carrot.png"];
            options[5][14] = [3, "Onion", 'LB', null, "onion.png"];
            options[5][15] = [4, "Apple", 'LB', null, "apple.png"];
            options[5][16] = [4, "Avocado", 'bg', null, "avocado.png"];
            options[5][17] = [4, "Strawberries", 'qt', null, "strawberry.png"];
            options[5][18] = [4, "Peaches", 'LB', null, "peach.png"];
            options[5][19] = [4, "Pears", 'LB', null, "pear.png"];
            options[5][20] = [5, "Potato", 'LB', null, "potato.png"];
            options[5][21] = [5, "Barley", 'LB', null, "wheat.png"];
            options[5][22] = [5, "Bulgar", 'LB', null, "wheat.png"];
            options[5][23] = [5, "Sweet Potato", 'LB', null, "potato.png"];
            options[5][24] = [5, "Quinoa", 'LB', null, "grain.png"];
            options[5][25] = [6, "Apple Pie", 'EA', null, "pie.png"];
            options[5][26] = [6, "Pumpkin Pie", 'EA', null, "pie.png"];
            options[5][27] = [6, "Muffin", 'EA', null, "muffin.png"];
            options[5][28] = [6, "Cinnamon Bun", 'EA', null, "cinnamon-roll.png"];
            options[5][29] = [6, "Banana Bread", 'EA', null, "banana-bread.png"];

            insertStatements.push(product);

            var vendorproduct = "INSERT INTO vendorproduct(vendorId,productId,quantityOnHand,price) VALUES(?,?,?,?);";
            options[6][0] = [1, 22, 20, 3.00];
            // options[6][1] = [1, 7, 10, 5.00];
            // options[6][2] = [1, 19, 70, 3.00];
            // options[6][3] = [1, 3, 35, 2.00];
            // options[6][4] = [1, 2, 5, 1.50];
            options[6][1] = [2, 1, 25, 3.00];
            // options[6][6] = [2, 6, 10, 4.00];
            // options[6][7] = [2, 30, 66, 3.00];
            // options[6][8] = [2, 11, 30, 2.50];
            // options[6][9] = [2, 20, 5, 5.00];
            options[6][2] = [3, 19, 11, 2.75];
            // options[6][11] = [3, 28, 12, 4.00];
            // options[6][12] = [3, 30, 66, 3.50];
            // options[6][13] = [3, 13, 30, 2.50];
            // options[6][14] = [3, 25, 15, 5.00];
            options[6][3] = [4, 18, 25, 3.00];
            // options[6][16] = [4, 5, 3, 3.50];
            // options[6][17] = [4, 3, 36, 3.00];
            // options[6][18] = [4, 18, 35, 4.00];
            // options[6][19] = [4, 2, 15, 5.00];
            options[6][4] = [5, 19, 25, 3.00];
            // options[6][21] = [5, 14, 8, 4.00];
            // options[6][22] = [5, 21, 66, 3.00];
            // options[6][23] = [5, 11, 20, 2.50];
            // options[6][24] = [5, 27, 5, 1.75];
            options[6][5] = [6, 4, 25, 3.00];
            // options[6][26] = [6, 6, 10, 2.50];
            // options[6][27] = [6, 16, 30, 3.00];
            // options[6][28] = [6, 17, 30, 2.50];
            // options[6][29] = [6, 10, 10, 5.00];
            options[6][6] = [7, 3, 25, 3.25];
            // options[6][31] = [7, 9, 10, 2.50];
            // options[6][32] = [7, 11, 30, 4.50];
            // options[6][33] = [7, 20, 30, 2.50];
            // options[6][34] = [7, 10, 10, 1.25];

            insertStatements.push(vendorproduct);

            var user = "INSERT INTO user(username,email,password,firstName,lastName," +
                        "birthYear,birthMonth,birthDay,address,provinceCode," +
                        "city,postalCode,isVendor) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?);";

            options[7][0] = ["jdoe","johndoe@gmail.com","123","John","Doe","1990","09","20","123 Street St.","ON","Waterloo","N2J 1P1",true];
            options[7][1] = ["mmasters","marmasters@yahoo.ca","123","Mark","Masters","1969","09","20","123 McDonald St.","ON","Waterloo","N2J 1P1",true];
            options[7][2] = ["megwhite","MegWhite@outlook.ca","123","Meg","White","1977","09","20","123 Inkerman St.","ON","Waterloo","N2J 1P1",true];
            options[7][3] = ["mattjones","MattJones@gmail.com","123","Matt","Jones","1998","09","20","123 Main St.","ON","Waterloo","N2J 1P1",true];
            options[7][4] = ["jmark","JohnMark@rogers.ca","123","John","Mark","1967","09","20","123 Queen St.","ON","Waterloo","N2J 1P1",true];
            options[7][5] = ["brett.hall","BrettHall@gmail.com","123","Brett","Hall","1993","09","20","123 Front St.","ON","Waterloo","N2J 1P1",true];
            options[7][6] = ["steve","stevehendricks@gmail.com","123","Steve","Hendricks","1980","09","20","123 King St.","ON","Waterloo","N2J 1P1",true];
            options[7][7] = ["notavendor","notavendor@gmail.com","123","Nota","Vendor","1985","09","21","123 North St.","ON","Waterloo","N2J 1P1",false];

            insertStatements.push(user);

            function successInsert(){
                console.info("Successfully populated table with data");
            }
            for(var i = 0; i < insertStatements.length; i++){
                for(var j = 0; j < options[i].length; j++){
                    tx.executeSql(insertStatements[i], options[i][j], successInsert, errorHandler);
                    // alert("i:" + i + "j:" + j + "\n\n" + insertStatements[i] + "\n\n" + options[i,j]);
                }
            }
        }
        db.transaction(txFunction, errorHandler, successTransaction);
    },

    //---DROP TABLE (debug)---
    dropTable: function(tableName){
        function txFunction(tx){
            var sql = "DROP TABLE IF EXISTS " + tableName + ";";
            function dropSuccess(tableName){
                console.info("Successfully dropped " + tableName + "table.");
            }
            try{
                tx.executeSql(sql, [], dropSuccess, errorHandler);
            }
            catch(e){
                console.error("Unable to drop table: " + e.message);
            }
        }
        db.transaction(txFunction, errorHandler, successTransaction);
    },
    dropAllTables: function(){
        function txFunction(tx){
            var tableNames = ["category", "product", "hours", "metric", "province",
                "user", "vendor", "vendorCrop", "vendorProduct"];
            function successDrop(){
                console.log("Successfully dropped table");
            }
            try{
                tableNames.forEach(function(element){
                    var sql = "DROP TABLE IF EXISTS " + element + ";";
                    tx.executeSql(sql, [], successDrop, errorHandler);
                });
            }
            catch(e){
                console.error(e.message);
            }
        }
        db.transaction(txFunction, errorHandler, successTransaction);
    }
}
