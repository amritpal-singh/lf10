window.phoneGapDB = {};
var that = null;
window.phoneGapDB.init = function() {
    that = this;
};

window.phoneGapDB.init();

/*
open database
If already opened then return old one
*/
window.phoneGapDB.openDB = function() {
    if(!window.phoneGapDB.db)
    {
        window.phoneGapDB.db = window.openDatabase("myStorage", "2.0", "myApp", 10485760);
    }
    return window.phoneGapDB.db;
};

window.phoneGapDB.generateTables = function(tx, tableName) {

    //tx.executeSql("DROP TABLE IF EXISTS " + tableName + "");
    tx.executeSql("CREATE  TABLE IF NOT EXISTS " + tableName + " (id INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL  UNIQUE ,key TEXT,data BLOB)");
    
};

window.phoneGapDB.insertRows = function(tx, d) {
    tx.executeSql("DELETE FROM " + d.table + " WHERE key = '"+d.key+"'");
    tx.executeSql("INSERT INTO " + d.table + " (id, key, data) VALUES (null, '"+d.key+"','"+ d.data +"')");
};

// transaction error callback
window.phoneGapDB.errorCB = function (tx, err) {
    console.group();
    console.log("Error processing SQL : "+err.message);
    console.groupEnd();
};

// transaction success callback
window.phoneGapDB.successCB = function () {
    console.log("Table created successfully.");
};

window.phoneGapDB.setItem = function(key, data, callback) {

    if(typeof callback != 'function') {
        callback = function () {};
    }

    switch(key){
        case 'seismicSavedOutput' :
        case 'seismicSessionInput' :
        case 'seismicSessionOutput' :
        case 'seismicScreen1' : 
        case 'seismicScreen2' :
                var table = 'seismic';
            break;
        case 'windSavedOutput' : 
        case 'windSessionInput' : 
        case 'windSessionOutput' :
        case 'windScreen1' : 
        case 'windScreen2' : 
                var table = 'wind';
            break;
        default:
            break;
    }
    var data = {'table' : table,
                'key' : key ,
                'data' : data};

    var db = this.openDB();
    db.transaction(function(tx) {
                                    that.generateTables(tx, table);
                                } , 
                                function (tx, err) 
                                {
                                    console.group();
                                    console.log("Error while generating DB");
                                    console.log(tx);
                                    console.log(err);
                                    console.groupEnd();
                                    callback(true, err);
                                },
                                function () {
                                    console.group();
                                    console.log("Table generated successfully");
                                    console.groupEnd();
                                    callback(false);
                                });
    db.transaction(function(tx) {
                                                        that.insertRows(tx, data);
                                                    } , 
                                                    function (tx, err) 
                                                    {
                                                        console.group();
                                                        console.log("Error while inserting row");
                                                        console.log(tx);
                                                        console.log(err);
                                                        console.groupEnd();
                                                    },
                                                    function () {
                                                        console.group();
                                                        console.log("Row inserted successfully");
                                                        console.groupEnd();
                                                    }
                );
    
};


window.phoneGapDB.getItem = function(key, success) {
    switch(key){
        case 'seismicSavedOutput' :
        case 'seismicSessionInput' :
        case 'seismicSessionOutput' :
                var table = 'seismic';
            break;
        case 'windSavedOutput' : 
        case 'windSessionInput' : 
        case 'windSessionOutput' :
        case 'windScreen1' : 
        case 'windScreen2' : 
                var table = 'wind';
            break;
        default:
            break;
    }
    var data = {'table' : table,
                'key' : key};
    var db = this.openDB();
    
    db.transaction(function(tx) {
                                    that.queryDB(tx, data,function(data){
                                    that.retData = data;

                                    });
                                } ,
                                function (tx, err) 
                                {
                                    console.group();
                                    console.log("Error in query transaction");
                                    console.log(tx);
                                    console.log(err);
                                    console.groupEnd();
                                },
                                function () 
                                {
                                    console.group();
                                    console.log("successfull query transactionn");
                                    console.groupEnd();
                                    success(that.retData);
                                });

};

window.phoneGapDB.getItems = function(table, success) {
        
    var db = this.openDB();
    
    db.transaction(function(tx) {
                                    that.queryDB1(tx, table,function(data){
                                    
                                    that.retData = data;

                                    });
                                } ,
                                function (tx, err) 
                                {
                                    console.group();
                                    console.log("Error in query transaction");
                                    console.log(tx);
                                    console.log(err);
                                    console.groupEnd();
                                },
                                function () 
                                {
                                    console.group();
                                    console.log("successfull query transactionn");
                                    console.groupEnd();
                                    success(that.retData);
                                });

};

window.phoneGapDB.queryDB1 = function (tx, table, success) {
    tx.executeSql('SELECT * FROM ' + table,
                  [],
                  function(tx,results)
                    {
                        console.group();
                        console.log("successfull query");
                        console.groupEnd();
                        var retData = [];
                        var len = results.rows.length;
                        if(len>0)
                        {
                            for (var i = 0; i < len; i++) 
                            {
                                retData.push(results.rows.item(i));
                            }
                        }
                        if(typeof success == 'function')
                        {
                            success(retData);
                        }


                    },
                  function (tx, err) 
                    {
                        console.group();
                        console.log("Error in query");
                        console.log(tx);
                        console.log(err);
                        console.groupEnd();
                    });

    return this.queryData;
};

window.phoneGapDB.removeItem = function(key) {
    switch(key){
        case 'seismicSavedOutput' :
        case 'seismicSessionInput' :
        case 'seismicSessionOutput' :
                var table = 'seismic';
            break;
        case 'windSavedOutput' : 
        case 'windSessionInput' : 
        case 'windSessionOutput' :
        case 'windScreen1' : 
        case 'windScreen2' : 
                var table = 'wind';
            break;
        default:
            break;
    }
    var data = {'table' : table,
                'key' : key};
    var db = this.openDB();
    
    db.transaction(function(tx) {
                                    tx.executeSql("DELETE FROM " + d.table + " WHERE key = '"+d.key+"'");
                                } ,
                                function (tx, err) 
                                {
                                    console.group();
                                    console.log("Error in query transaction");
                                    console.log(tx);
                                    console.log(err);
                                    console.groupEnd();
                                },
                                function () 
                                {
                                    console.group();
                                    console.log("successfull query transactionn");
                                    console.groupEnd();
                                });

};

window.phoneGapDB.queryDB = function (tx, d, success) {
    tx.executeSql('SELECT * FROM ' + d.table + ' WHERE key = "' + d.key + '"',
                  [],
                  function(tx,results)
                    {
                        console.group();
                        console.log("successfull query");
                        console.groupEnd();
                        var retData = [];
                        var len = results.rows.length;
                        if(len>0)
                        {
                            for (var i = 0; i < len; i++) 
                            {
                                retData.push(results.rows.item(i));
                            }
                        }
                        if(typeof success == 'function')
                        {
                            success(retData);
                        }


                    },
                  function (tx, err) 
                    {
                        console.group();
                        console.log("Error in query");
                        console.log(tx);
                        console.log(err);
                        console.groupEnd();
                    });

    return this.queryData;
};


// Query the success callback
//
function querySuccess(tx, results) {
    // this will be empty since no rows were inserted.
    //console.log("Insert ID = " + results.insertId);
    // this will be 0 since it is a select statement
    //console.log("Rows Affected = " + results.rowAffected);
    // the number of rows returned by the select statement
    //console.log("Insert ID = " + results.rows.length);
    console.log(results);
}
