/**
 * Mobile Web Development
 * Final Assignment
 *
 * File Name: stockboyDAL.js
 *
 * Revision History:
 *       Brett Hall and Singithi Kandage, 2018-03-15 : Created
 */


var Product = {
   insert: function(options, callback){
        function txFunction(tx){
            var sql = "INSERT INTO product(categoryId, name, metricId, description) VALUES(?,?,?,?);";
            tx.executeSql(sql, options, callback, errorHandler);
        }
        db.transaction(txFunction, errorHandler, successTransaction);
    },

    update: function(options, callback){
        function txFunction(tx){
            var sql = "UPDATE product SET categoryId=?, name=?, metricId=?, description=?, WHERE productId=?;";
            tx.executeSql(sql, options, callback, errorHandler);
        }
        db.transaction(txFunction, errorHandler, successTransaction);
    },

    delete: function(options, callback){
        function txFunction(tx){
            var sql = "DELETE FROM product WHERE productId = ?;";
            tx.executeSql(sql, options, callback, errorHandler);
        }
        db.transaction(txFunction, errorHandler, successTransaction);
    },

    selectAllProducts: function(options, callback){
        function txFunction(tx){
            var sql = "SELECT * FROM product;";
            tx.executeSql(sql, options, callback, errorHandler);
        }
        db.transaction(txFunction, errorHandler, successTransaction);
    }
};

var Province = {
    selectAllProvinces: function(options, callback){
        function txFunction(tx){
            var sql = "SELECT*FROM province;";
            tx.executeSql(sql, options, callback, errorHandler);
        }
        db.transaction(txFunction, errorHandler, successTransaction);
    }
};

var User = {
    insert: function(options, callback){
        function txFunction(tx){
            var sql = "INSERT INTO user(username, email, " + "" +
                "password, firstName, lastName, " +
                "birthYear, birthMonth, birthDay, " +
                "address, provinceCode, city, postalCode,isVendor) " +
                "VALUES(?,?,?,?,?,?,?,?,?,?,?,?, ?);";
            tx.executeSql(sql, options, callback, errorHandler);
        }
        db.transaction(txFunction, errorHandler, successTransaction);
    },

    selectOneUser: function(options, callback){
        function txFunction(tx){
            var sql = "SELECT * FROM user WHERE username = ?";
            tx.executeSql(sql, options, callback, errorHandler);
        }
        db.transaction(txFunction, errorHandler, successTransaction);
    },

    selectUserById: function(options, callback){
        function txFunction(tx){
            var sql = "SELECT * FROM user WHERE userId=?";
            tx.executeSql(sql, options, callback, errorHandler);
        }
        db.transaction(txFunction, errorHandler, successTransaction);
    }
};

var Vendor = {
    insert: function(options, callback){
        function txFunction(tx){
            var sql = "INSERT INTO vendor(userId, name, " +
                "address, town, provinceCode, " +
                "postalCode, longitude, latitude, " +
                "phone, email) VALUES(?,?,?,?,?,?,?,?,?,?);";
            tx.executeSql(sql, options, callback, errorHandler);
        }
        db.transaction(txFunction, errorHandler, successTransaction);
    },

    selectOneVendor: function(options, callback){
        function txFunction(tx){
            var sql = "SELECT vendor.vendorId AS 'vendorId', vendor.name AS 'name', vendor.address AS 'address', vendor.town AS 'town', province.name AS 'province', vendor.postalCode AS 'postalCode', vendor.phone AS 'phone', vendor.email AS 'email'" +
                "FROM vendor " +
                "JOIN province USING(provinceCode)" +
                "WHERE vendor.vendorId = ?;";
            tx.executeSql(sql, options, callback, errorHandler);
        }
        db.transaction(txFunction, errorHandler, successTransaction);
    },

    selectOneVendorByUser: function(options, callback){
        function txFunction(tx){
            var sql = "SELECT * FROM vendor WHERE userId=?;";
            tx.executeSql(sql, options, callback, errorHandler);
        }
        db.transaction(txFunction, errorHandler, successTransaction);
    },

    selectAllVendors: function(options, callback){
        function txFunction(tx){
            var sql = "SELECT*FROM vendor;";
            tx.executeSql(sql, options, callback, errorHandler);
        }
        db.transaction(txFunction, errorHandler, successTransaction);
    },
};

var VendorProduct= {
    insert: function(options, callback){
        function txFunction(tx){
            var sql = "INSERT INTO vendorproduct (vendorId, productId, quantityOnHand, price, onSale) VALUES (?,?,?,?,?);";
            tx.executeSql(sql, options, callback, errorHandler);
        }
        db.transaction(txFunction, errorHandler, successTransaction);
    },

    update: function(options, callback){
        function txFunction(tx){
            var sql = "UPDATE vendorproduct SET vendorId=?, productId=?, quantityOnHand=?, price=?, onSale = ? WHERE vendorProductId=?;";
            tx.executeSql(sql, options, callback, errorHandler);
        }
        db.transaction(txFunction, errorHandler, successTransaction);
    },

    delete: function(options, callback){
        function txFunction(tx){
            var sql = "DELETE FROM vendorproduct WHERE vendorProductId=?;";
            tx.executeSql(sql, options, callback, errorHandler);
        }
        db.transaction(txFunction, errorHandler, successTransaction);
    },

    selectAllProducts: function(options, callback){
        function txFunction(tx){
            var sql = "SELECT vendorproduct.vendorProductId AS 'vendorProductId',"
                + " product.name AS 'name', product.description AS 'description',"
                + " product.imageName, metric.metricCode,"
                + " vendor.name AS 'vendor', vendorproduct.price AS 'price',"
                + " vendor.longitude AS 'longitude', vendor.latitude As 'latitude'"+
                "FROM vendorproduct " +
                "JOIN product USING(productId)" +
                "JOIN vendor USING(vendorId)" +
                "JOIN metric USING(metricCode);";
            tx.executeSql(sql, options, callback, errorHandler);
        }
        db.transaction(txFunction, errorHandler, successTransaction);
    },

    selectAllProductsByVendor: function(options, callback){
        function txFunction(tx){
            var sql = "SELECT vendorproduct.vendorProductId AS 'vendorProductId', vendorproduct.productId AS 'productId', vendorproduct.vendorId AS 'vendorId', product.name AS 'name', product.description AS 'description',  product.categoryId AS 'categoryId', product.metricCode AS 'metricCode', vendor.name AS 'vendor', vendorproduct.price AS 'price', vendorproduct.onSale as 'onSale', vendor.longitude AS 'longitude', vendor.latitude As 'latitude' " +
                "FROM vendorproduct " +
                "JOIN product USING(productId)" +
                "JOIN vendor USING(vendorId)" +
                "WHERE vendorId = ?";
            tx.executeSql(sql, options, callback, errorHandler);
        }
        db.transaction(txFunction, errorHandler, successTransaction);
    },

    selectOneVendorProduct: function(options, callback){
        function txFunction(tx){
            var sql = "SELECT vendorproduct.vendorProductId AS 'vendorProductId', vendorproduct.productId AS 'productId', vendorproduct.vendorId AS 'vendorId', product.name AS 'name', product.description AS 'description',  product.categoryId AS 'categoryId', product.metricCode AS 'metricCode', vendor.name AS 'vendor', vendorproduct.price AS 'price', vendorproduct.onSale as 'onSale', vendor.longitude AS 'longitude', vendor.latitude As 'latitude' " +
                "FROM vendorproduct " +
                "JOIN product USING(productId)" +
                "JOIN vendor USING(vendorId)" +
                "WHERE vendorproduct.vendorProductId = ?";
            tx.executeSql(sql, options, callback, errorHandler);
        }
        db.transaction(txFunction, errorHandler, successTransaction);
    },
    selectVendorProduct: function(options, callback){
        function txFunction(tx){
            var sql = "SELECT * FROM vendorproduct WHERE vendorproduct.vendorProductId = ?";
            tx.executeSql(sql, options, callback, errorHandler);
        }
        db.transaction(txFunction, errorHandler, successTransaction);
    }
};

var ShoppingList= {
    insert: function(options, callback){
        function txFunction(tx){
            var sql = "INSERT INTO shoppingList(userId, vendorProductId) " +
                "VALUES(?,?);";
            tx.executeSql(sql, options, callback, errorHandler);
        }
        db.transaction(txFunction, errorHandler, successTransaction);
    },

    delete: function(options, callback){
        function txFunction(tx){
            var sql = "DELETE FROM shoppinglist WHERE id = ?";
            tx.executeSql(sql, options, callback, errorHandler);
        }
        db.transaction(txFunction, errorHandler, successTransaction);
    },

    selectAllListItemsByUser: function(options, callback){
        function txFunction(tx){
            var sql = "SELECT shoppingList.id AS 'id', vendorproduct.vendorProductId AS 'vendorProductId', product.name AS 'name', product.description AS 'description', vendor.name AS 'vendor', vendorproduct.price AS 'price'"+
                "FROM shoppinglist " +
                "JOIN vendorproduct USING(vendorProductId) " +
                "JOIN product USING(productId) " +
                "JOIN vendor USING(vendorId) " +
                "JOIN user USING(userId) " +
                "WHERE shoppinglist.userId = ?";
            tx.executeSql(sql, options, callback, errorHandler);
        }
        db.transaction(txFunction, errorHandler, successTransaction);
    }
};