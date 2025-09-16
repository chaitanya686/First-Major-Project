if(process.env.NODE_ENV!='production'){
require('dotenv').config();
}


const express= require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError=require("./utils/ExpressError.js");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');


const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method')); // For PUT and DELETE requests
app.engine('ejs', ejsMate); // Use ejsMate for layout support
app.use(express.static(path.join(__dirname, '/public'))); // Serve static files from the public directory


const dbUrl=process.env.ATLAS_DB_URL;
main().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});
async function main() {
    await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret:process.env.SECRET
    },
    touchAfter: 24 * 3600 // time period in seconds
});
store.on("error", function(e){
    console.log("SESSION STORE ERROR", e);
});

sessionOptions={
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    },
};

// app.get('/', (req, res) => {
//     res.send('Welcome to the Major Projects API');
// });



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //authenticate method is added by passport-local-mongoose plugin
passport.serializeUser(User.serializeUser()); //serializeUser method-> user ki info ko session me store karne ke liye use hota hai...ye method passport-local-mongoose plugin dwara add kiya jata hai
passport.deserializeUser(User.deserializeUser()); //deserializeUser method-> session se user ki info ko retrieve karne ke liye use hota hai...ye method bhi passport-local-mongoose plugin dwara add kiya jata hai


app.use((req, res, next) => {
    res.locals.success=req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser=req.user;
    next(); //next ko call karna jaruri hai warna ye atak jayega yaha par
});


app.use('/listings', listingRouter);
app.use('/listings/:id/reviews', reviewRouter);
app.use('/', userRouter);



app.use((req, res, next) => { //---tigdam lagal ke chala liya ...hahahaha
    next(new ExpressError(404, "Page not Found!!"));
});

app.use((err,req,res,next) => {
    let{statusCode=500,message="Something went wrong!"}=err;
   // res.status(statusCode).send(message);
   res.status(statusCode).render('error.ejs', {message});
    
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});