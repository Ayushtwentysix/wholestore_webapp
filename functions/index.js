const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');
const engines = require('consolidate');
const session = require("express-session");
 const FirebaseStore = require('connect-session-firebase')(session);
const app = express();
var bodyParser =require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());



app.engine('hbs', engines.handlebars);
app.set('views','./views');
app.set('view engine', 'hbs');
var handlebars = require('handlebars');
// var helpers = require('handlebars-helpers');
// var helpers = require('template-helpers');
var helpers = require('handlebars-form-helpers').register(handlebars);


const hbs = require('express-handlebars');
var exhbs = hbs.create({
   defaultLayout: 'main',
    helpers      : helpers,
});


const appTwo = express();
appTwo.use(bodyParser.urlencoded({extended: true}));
appTwo.use(bodyParser.json());
appTwo.engine('hbs', engines.handlebars);
appTwo.set('views','./views');
appTwo.set('view engine', 'hbs');

const appThree = express();
appThree.use(bodyParser.urlencoded({extended: true}));
appThree.use(bodyParser.json());
appThree.engine('hbs', engines.handlebars);
appThree.set('views','./views');
appThree.set('view engine', 'hbs');


const appFour = express();
appFour.use(bodyParser.urlencoded({extended: true}));
appFour.use(bodyParser.json());
appFour.engine('hbs', engines.handlebars);
appFour.set('views','./views');
appFour.set('view engine', 'hbs');

const appFive = express();
appFive.use(bodyParser.urlencoded({extended: true}));
appFive.use(bodyParser.json());
appFive.engine('hbs', engines.handlebars);
appFive.set('views','./views');
appFive.set('view engine', 'hbs');


const appSix = express();
appSix.use(bodyParser.urlencoded({extended: true}));
appSix.use(bodyParser.json());
appSix.engine('hbs', engines.handlebars);
appSix.set('views','./views');
appSix.set('view engine', 'hbs');


const appSeven = express();
appSeven.use(bodyParser.urlencoded({extended: true}));
appSeven.use(bodyParser.json());
appSeven.engine('hbs', engines.handlebars);
appSeven.set('views','./views');
appSeven.set('view engine', 'hbs');

const appEight = express();
appEight.use(bodyParser.urlencoded({extended: true}));
appEight.use(bodyParser.json());
appEight.engine('hbs', engines.handlebars);
appEight.set('views','./views');
appEight.set('view engine', 'hbs');


// var fs = require('file-system');
// var indexHTML = fs.readFileSync(`${__dirname}/views/home.hbs`, 'utf8');



var nodemailer = require('nodemailer');

const firebaseApp = firebase.initializeApp(
    functions.config().firebase
);


function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;
    
      this.add = function(item, id) {
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = {item: item, qty: 0, price: 0};
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.price;
    };
    
       this.removeItem = function(id) {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    };
    
        this.generateArray = function() {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
}



app.get("/",(request, response) =>{
    
    function getFacts(){
    var ref = firebaseApp.database().ref('products');
    return ref.once('value').then(snap => snap.val());
    
}
    

  getFacts().then(facts => {
      console.log("home products",facts);
     response.render('home',{facts})
        
        return null;
     
    }).catch(error => {
              console.log('error', error);
            });

//   return response.render('trial1.hbs', {info});
});

var cookieParser = require("cookie-parser");


appSeven.use(session({
      store: new FirebaseStore({
        database: firebaseApp.database()
      }),
      name: '__session',
      secret: 'mysupersecret',
      resave: true,
      saveUninitialized: true,
      cookie: {maxAge : 10*60*1000 }
    }));
appSeven.use(cookieParser('mysupersecret'));

appSeven.get('/add-to-cart/:idp', function(req, res){
    var productTitle = req.params.idp;
    var ref = firebaseApp.database().ref('products');
    var cart = new Cart(req.session.cart ? req.session.cart : {});
 
     ref.orderByChild('title').equalTo(productTitle).on('child_added',function(snap,err){
        if(err){
            console.log("error",err);
            return res.redirect('/');
        }
        else{
            console.log("Products from session",snap.val());
         cart.add(snap.val(), snap.key);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/shopping-cart');
        return null;
        }
     
    });
     return res.locals.session = req.session;
});

appSeven.get('/remove/:idtitle',function(req,res){
       var productTitle = req.params.idtitle;
    var ref = firebaseApp.database().ref('products');
    var cart = new Cart(req.session.cart ? req.session.cart : {});
         ref.orderByChild('title').equalTo(productTitle).on('child_added',function(snap,err){
        if(err){
            console.log("error",err);
            return res.redirect('/');
        }
        else{
            console.log("Products to reduceByOne",snap.val());
            var productid= snap.key;
           cart.removeItem(productid);
        req.session.cart = cart;
        res.redirect('/shopping-cart');
        return null;
        }
     
    });
        
        
        
     
        
        
    
});

appSeven.get('/list/add-to-cart/:idp', function(req, res){
    var productTitle = req.params.idp;
    var ref = firebaseApp.database().ref('products');
    var cart = new Cart(req.session.cart ? req.session.cart : {});
 
     ref.orderByChild('title').equalTo(productTitle).on('child_added',function(snap,err){
        if(err){
            console.log("error",err);
            return res.redirect('/');
        }
        else{
            console.log("Products from session",snap.val());
         cart.add(snap.val(), snap.key);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/shopping-cart');
        return null;
        }
     
    });
     return res.locals.session = req.session;
});

// appSeven.use(function(req,res){
//     console.log("This is session 1",req.session);
//      res.locals.session = req.session;
// });

appSeven.get('/shopping-cart', function(req, res) {
   if(!req.session.cart){
       return res.render('cart2' ,{products:null});
   } 
   var cart = new Cart(req.session.cart);
   res.render('cart2', {products: cart.generateArray(), totalPrice: cart.totalPrice} );
   
});


appTwo.get("/select/:pname",(request, response) =>{
     var ref = firebaseApp.database().ref('products');
    var pname = request.params.pname;
    ref.orderByChild('title').equalTo(pname).on('child_added',function(snap,err){
        if(err){
            console.log("error",err);
        }
        else {
            var fact = snap.val();
        console.log(fact);
        response.render('productDetails',{fact});
        return null;
        }
        
    });
    
});

appThree.get("/categories/clothing/:type",(request,response) =>{
        var type = request.params.type;
 var ref = firebaseApp.database().ref('categories/clothing/'+type);
     ref.orderByChild('title').on('value',function(snap){
        var facts = snap.val();
        console.log(facts);
        response.render('product',{facts});
        return null;
    });
    
});

appFour.get('/contact_us', (request,response) =>{
    response.render('contactUs.hbs');
});

appFive.get("/about_us", (req,res) =>{
    res.render("aboutUs.hbs");
});

appEight.post('/shopping-cart/send/final',(req,res) =>{
    
    const output = `
    <h3>Shipping Details</h3>
    <ul>
    <li><strong>Name</strong>: ${req.body.name} </li>
    <li><strong>Company</strong>: ${req.body.company} </li>
    <li><strong>Address</strong>: ${req.body.shippingAddress} </li>
    <li><strong>City</strong>: ${req.body.shippingCity} </li>
    <li><strong>State</strong>: ${req.body.shippingState} </li>
    <li><strong>Zip</strong>: ${req.body.shippingZip} </li>
    <li><strong>Email</strong>: ${req.body.email} </li>
    <li><strong>Phone</strong>: ${req.body.phoneOne} </li>
  
    </ul>
    `;    
    
   
    
        if(typeof(req.body.pName)==='string'){
        content1 = '<td style=" border: 1px solid black; border-collapse: collapse;">'+req.body.pName+'</td>';
    }
    else {
          var content1 = req.body.pName.reduce(function(a,b){
        return a + '<td style=" border: 1px solid black; border-collapse: collapse;">'+b+'</td>';
    },'');
    }
    
        if(typeof(req.body.pPrice)==='string'){
        content2 = '<td style=" border: 1px solid black; border-collapse: collapse;">'+req.body.pPrice+'</td>';
    }
    else {
          var content2 = req.body.pPrice.reduce(function(a,b){
        return a + '<td style=" border: 1px solid black; border-collapse: collapse;">$'+b+'</td>';
    },'');
    }
    
          if(typeof(req.body.pQty)==='string'){
        content3 = '<td style=" border: 1px solid black; border-collapse: collapse;">'+req.body.pQty+'</td>';
    }
    else {
          var content3 = req.body.pQty.reduce(function(a,b){
        return a + '<td style=" border: 1px solid black; border-collapse: collapse;">'+b+'</td>';
    },'');
    }
    
           if(typeof(req.body.pPriceTotal)==='string'){
        content4 = '<td style=" border: 1px solid black; border-collapse: collapse;">'+req.body.pPriceTotal+'</td>';
    }
    else {
          var content4 = req.body.pPriceTotal.reduce(function(a,b){
        return a + '<td style=" border: 1px solid black; border-collapse: collapse;">$'+b+'</td>';
    },'');
    }
    
             if(typeof(req.body.pPriceTotal)==='string'){
        content5 = req.body.pPriceTotal;
    }
    else {
          var content5 = req.body.pPriceTotal.reduce(function(a,b){
        return parseInt(a, 10) + parseInt(b, 10);
    },0);
    }
    
     const output2 = `$${content5}`;
        
    var transporter = nodemailer.createTransport({
 service: 'gmail',
 secure: true,
 auth: {
        user: 'gupta.ayush1997@gmail.com',
        pass: 'iwanttobeabankpoin2022'
    }
});

const mailOptions = {
  from: 'gupta.ayush1997@gmail.com', // sender address
  to: req.body.mailOne, // list of receivers
  subject: 'Receipt:', // Subject line
     html: output+'<p><h3>Product Details</h3><p/>'+'<div><table style=" width:75%; border: 1px solid black; border-collapse: collapse;"><tbody><tr style=" border: 1px solid black; border-collapse: collapse;"><td style=" border: 1px solid black; border-collapse: collapse;"><strong>Product:</strong></td>'+content1+'</tr><tr style=" border: 1px solid black; border-collapse: collapse;"><td style=" border: 1px solid black; border-collapse: collapse;"><strong>Price/Item:</strong></td>'+content2+'</tr><tr style=" border: 1px solid black; border-collapse: collapse;"><td style=" border: 1px solid black; border-collapse: collapse;"><strong>Qty:</strong></td>'+content3+'</tr><tr style=" border: 1px solid black; border-collapse: collapse;"><td style=" border: 1px solid black; border-collapse: collapse;"><strong>Total:</strong></td>'+content4+'</tr></tr><tr style=" border: 1px solid black; border-collapse: collapse;"><td style=" border: 1px solid black; border-collapse: collapse;"><strong>Gross Total:</strong></td><td style=" border: 1px solid black; border-collapse: collapse;">'+output2+'</td></tr></tbody></table>'// plain text body

    
};

transporter.sendMail(mailOptions, function (err, info) {
  if(err)
     console.log(err)
  else
     console.log(info);
//   res.render('home' ,{msg: "Email has been sent !"} );
res.redirect('/');
 return null;
});




});

appSix.post('/shopping-cart/send',(req,res) => {
    // var products = req.body;
    var array1 = [];
  var sum=0
    console.log("type:",typeof(req.body));
      
        console.log("req.body:",req.body);
    res.render("checkout.hbs",{products: req.body.products ,  
    helpers:{
        multiply: function(thing1, thing2){  return thing1*thing2; }
        // totalP: function(a,b){ var mul = a*b; array1.push(mul); array1.map(function(val){
        //     return sum=sum+val;
        // }) }
    }});

    
    // for(var i=0;i<req.length;i++){
    //     const output2 =`
    //     <ul>
    //     <li>Product Name: ${req.body.productName}</li>
    //     </ul>
    //     `    }
    
//     const output = `
//     <p>You have a new contact request</p>
//     <h3>Contact Details:</h3>
//     <ul>
//     <li>Name: ${req.body.name} </li>
//     <li>Company: ${req.body.company} </li>
//     <li>Email: ${req.body.email} </li>
//     <li>Phone: ${req.body.phone} </li>
  
//     </ul>
//     <h3> Message:</h3>
//     <p> ${req.body.message}</p>
    
//     `;
    
    
//     const output2 =`
//     <p><h3>Total Cost: ${req.body.productTotal}</h3></p>
//     `
//     // console.log("quantity:",req.body.quantity);
//     // console.log("type of:", typeof(req.body.quantity));
//     // console.log("length:", req.body.quantity.length);
    
//     if(typeof(req.body.quantity)==='string'){
//         content2 = '<td style=" border: 1px solid black;">'+req.body.quantity+'</td>';
//     }
//     else {
//           var content2 = req.body.quantity.reduce(function(a,b){
//         return a + '<td style=" border: 1px solid black;">'+b+'</td>';
//     },'');
//     }
  
//   if(typeof(req.body.productName)==='string'){
//         content1 = '<td style=" border: 1px solid black;">'+req.body.productName+'</td>';
//     }
//     else {
//      var content1 = req.body.productName.reduce(function(a,b){
  
//         return  a +'<td style=" border: 1px solid black;">'+b+'</td>';
//     },'');
//     }
  
//     if(typeof(req.body.productPrice)==='string'){
//         content3 = '<td style=" border: 1px solid black;">'+req.body.productPrice+'</td>';
//     }
//     else {
//      var content3 = req.body.productPrice.reduce(function(a,b){
  
//         return  a +'<td style=" border: 1px solid black;">'+b+'</td>';
//     },'');
//     }
// // console.log("price type",typeof(req.body.productPrice));
   
//     // var content3 = req.body.productPrice.reduce(function(a,b){
//     //     return a + '<td style=" border: 1px solid black;">'+b+'</td>';
//     // },'');
 
    
//     var transporter = nodemailer.createTransport({
//  service: 'gmail',
//  secure: true,
//  auth: {
//         user: 'gupta.ayush1997@gmail.com',
//         pass: 'iwanttobeabankpoin2022'
//     }
// });

// const mailOptions = {
//   from: 'gupta.ayush1997@gmail.com', // sender address
//   to: req.body.email, // list of receivers
//   subject: '1st email from nodemailer', // Subject line
//   html: output+'<div><table style=" border: 1px solid black;"><tbody><tr style=" border: 1px solid black;"><td style=" border: 1px solid black;"><strong>Product:</strong></td>'+content1+'</tr><tr style=" border: 1px solid black;"><td style=" border: 1px solid black;"><strong>Quantity:</strong></td>'+ content2+'</tr><tr style=" border: 1px solid black;"><td style=" border: 1px solid black;"><strong>Price:</strong></td>'+content3+'</tr></tbody></table>'// plain text body
// };

// transporter.sendMail(mailOptions, function (err, info) {
//   if(err)
//      console.log(err)
//   else
//      console.log(info);
// //   res.render('home' ,{msg: "Email has been sent !"} );
// res.redirect('/');
//  return null;
// });

});


exports.app = functions.https.onRequest(app);
exports.appTwo = functions.https.onRequest(appTwo);
exports.appThree=functions.https.onRequest(appThree);   
exports.appFour = functions.https.onRequest(appFour);
exports.appFive = functions.https.onRequest(appFive);
exports.appSix = functions.https.onRequest(appSix);
exports.appSeven = functions.https.onRequest(appSeven);
exports.appEight = functions.https.onRequest(appEight);

    // app.get("/:pname",(request, response) =>{
//     var pname = request.params.pname;
   
//       getFactstwo().then(fact => {
//           console.log("each product details",fact);
//         response.render('productDetails',{fact});
//         return null;
//       }).catch(error => {
//               console.log('error', error);
//             });
// });
    

// appTwo.get("/about",(request, response) =>{
//     const infoTwo = JSON.stringify({
//         about:'he is a good person'
//     });
//     return response.render('trial2.hbs', {infoTwo});
// });

// exports.app = functions.https.onRequest((req,res) => {
    
//     const info = JSON.stringify({
//         name:'ayush'
//     });
//   return res.render('trial1.hbs', {info:info});
// });


// function getFactstwo(){
//     var ref = firebaseApp.database().ref('products');
//     return ref.orderByChild('title').equalTo('T-Shirt').on('child_added',data => {
//       console.log(data.val());
//       return data.val();
// });
    
    
// }
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

// app.get("/",(request, response) =>{
//   getFacts().then(facts => {
//       console.log("home products",facts);
//      response.render('home',{facts})
//         // response.render('home' , { facts });
//         return null;
     
//     }).catch(error => {
//               console.log('error', error);
//             });

// });

// app.get("/:pname",(request, response) =>{
//     var pname = request.params.pname;
   
//       getFactstwo().then(fact => {
//           console.log("each product details",fact);
//         response.render('productDetails',{fact});
//         return null;
//       }).catch(error => {
//               console.log('error', error);
//             });
// });
    




// app.set('views', __dirname + '/views');
// app.engine('hbs', hbs.renderFile);
// app.set('view engine', 'hbs');
// appTwo.set('views', __dirname + '/views');
// appTwo.engine('hbs', hbs.renderFile);
// appTwo.set('view engine', 'hbs');
// var path = require("path");
// app.engine('hbs', hbs({extname: 'hbs', defualtLayout : 'layout' , layoutDir: __dirname + '/views'}));
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');




// exports.appTwo = functions.https.onRequest((req,res) => {
    
//     const infoTwo = JSON.stringify({
//         about:'he is a good person'
//     });
//     return res.render('trial2', {infoTwo});
// });
