var express = require('express'),
    app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');

const mssql = require("mssql");

const urlencodedParser = express.urlencoded({extended: false});

var can_request_ins = true;
var can_request_read = true;
var can_request_del = true;



var Connection = require('tedious').Connection;  
var config = {  
    server: 'localhost',  //update me
    authentication: {
        type: 'default',
        options: {
            userName: 'sa', //update me
            password: '123456'  //update me
        }
    },
    options: {
        trustServerCertificate: true,
        // If you are on Microsoft Azure, you need encryption:
        encrypt: true,
        database: 'master'  //update me
    }
}; 


var Request = require('tedious').Request;  
var TYPES = require('tedious').TYPES; 




app.get('/', (req, res) => {
    res.render('main/main');
});

app.get('/get_all_tasks', (req,res) =>{
    if(can_request_read){
        connection_read = new Connection(config);
        connection_read.connect();

        connection_read.on('connect', function(err) {  
            if(err) {
                console.log('Error: ', err)
            } else {
                can_request_read = false;

                get_tasks_json(res);
            }
        });  

        connection_read.on('end', function() {  
            console.log("open");
            can_request_read = true;
        });
    }else{
        response.sendStatus(400);
    }
});
app.post("/add_new_task", urlencodedParser, function (req, response) {
    if(!req.body) return response.sendStatus(400);

    if(can_request_ins){
        connection_ins = new Connection(config);
        connection_ins.connect();

        connection_ins.on('connect', function(err) {  
            if(err) {
                console.log('Error: ', err)
            } else {
                can_request_ins = false;

                insert_task(response,req.body.task_text);
            }
        });  
        connection_ins.on('end', function() {  
            console.log("open");
            can_request_ins = true;
        });
    }
});
app.post("/delete_task_by_id", urlencodedParser, function (req, response) {
    if(!req.body) return response.sendStatus(400);
    
    if(can_request_del){
        connection_del = new Connection(config);

        connection_del.connect();
        connection_del.on('connect', function(err) {  
            if(err) {
                console.log('Error: ', err)
            } else {
                can_request_del = false;

                delete_task_by_id(response, req.body.delete_id);
            }
        });
        connection_del.on('end', function() {  
            console.log("open");
            can_request_del = true;
        });
    }else{
        response.sendStatus(400);
    }
});


function insert_task(response, data){
    var request = new Request("INSERT INTO tasks (task_text)  VALUES(@task_text);SELECT TOP 1 * FROM tasks ORDER BY id DESC;", function(err) {  
        if (err) {  
           console.log(err);}  
    });  
    
    res = "";
    
    request.addParameter('task_text', TYPES.Text,data);  

    request.on('row', function(columns) {  
        res = columns[0].value;
    });

    request.on("doneProc", function (rowCount, more) {
        response.send(`${res}`);
    });
    request.on("requestCompleted", function (rowCount, more) {
        connection_ins.close();
        // response.sendStatus(200);
    });
    if(can_request_ins == false){
        connection_ins.execSql(request);  
    }else{
        response.sendStatus(400);
    }
}

function get_tasks_json(res) {  
    var request = new Request("SELECT * FROM tasks;", function(err) {  
        if (err) {  
            console.log(err);}  
    });  
    var result = "{";  
    
    request.on('row', function(columns) {  
        if(result.length != 1){
            result += ","
        }
        result += "\"" + columns[0].value + "\"" + ":{\"task_text\":\"" + columns[1].value + "\"}";  
        // console.log(result);  

    });  
    request.on('doneProc', function (rowCount, more, returnStatus, rows) { 
        result +="}";  

        res.send(result);

    });  
    
    // Close the connection after the final event emitted by the request, after the callback passes
    request.on("requestCompleted", function (rowCount, more) {
            connection_read.close();
            // res.sendStatus(200);
            
    });
    if(can_request_read == false){
        connection_read.execSql(request);  
    }else{
        res.sendStatus(400);
    }
    // console.log("Done"); 
}  

function delete_task_by_id(response, task_id){
    var request = new Request("DELETE FROM tasks WHERE id=@id;", function(err) {  
        if (err) {  
            console.log(err);}  
    });  
    request.addParameter('id', TYPES.Int, Number(task_id)); 
    request.on("requestCompleted", function (rowCount, more) {
        connection_del.close();
        response.sendStatus(200);

    });
    if(can_request_del == false){
        connection_del.execSql(request);  
    }else{
        response.sendStatus(400);
    }

}

app.listen(8080);   