const express = require ("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const app = express();
const bodyParser = require("body-parser");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));



// /connecting with mongodb database
const uri = "mongodb+srv://gauravkatkade68:Gaurav%4012@cluster0.s7jejkw.mongodb.net/farmer?retryWrites=true&w=majority";
async function connect() {
  try {
    await mongoose.connect(uri);
    console.log("Successful connection to mongodb");
  }
  catch (error) {
    console.log(error);
  }
}
connect();



// table for users

const Username = new mongoose.Schema({

  email: {type:String},
  first_name: String,
  middle_name: String,
  last_name: String,
  password: String,
  // membership: { type: String, required: [true, "Please Enter yes/no for membership"] },
  address: String,
  no_of_product_issued: Number,
  phoneno: Number,
  // book_issued: { type: mongoose.Schema.Types.ObjectId, ref: "Book_Issued" },
  // books: { type: mongoose.Schema.Types.ObjectId, ref: "Book" }
})
const User = mongoose.model("User", Username);




// const Book_issued = new mongoose.Schema({
//   bookid: { type: Number },
//   issue_date: Date,
//   return_date: Date,
//   payment_status: String
// });

// const Book_Issued = mongoose.model("Book_issued", Book_issued);





const Product = new mongoose.Schema({
  email:String,
  productid: String ,
  issue_status: { type: String },
  product_type: { type: String },
  Product_name: { type: String },
  seller_name: { type: String },
  product_price: { type: Number },
  // Floor_no: { type: Number },
  // Section_no: { type: Number },
  // Shelf_no: { type: Number },
  // Row_no: { type: Number },
  purchased_date: Date,
  // return_date: Date,
  payment_status: String

})
const product = mongoose.model("Product", Product);




// const USER_PHONE = new mongoose.Schema({
//   phoneno: { type: Number, required: [true, "Please enter your phoneno"] }
// })

// const userphone = mongoose.model("USER_PHONE", USER_PHONE);



//home page
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/files/home.html");
});



//handling of login ans sign up 

app.post("/signUp", function (req, res) {
  const Fname = req.body.Fname;
  const Mname = req.body.Mname;
  const Lname = req.body.Lname;
  const address = req.body.address;
  const contact = req.body.contact;
  const email = req.body.email;
  const password = req.body.password;

  const new_signup = new User({
    email: email,
    first_name: Fname,
    middle_name: Mname,
    last_name: Lname,
    address: address,
    password: password,
    phoneno: contact

  });

  new_signup.save()
    .then(() => {
      res.redirect("/login");
    })
    .catch(err => {
      console.error("Error saving user:", err);
      // Handle the error appropriately, e.g., return an error response to the client
      res.status(500).send("Internal Server Error");
    });
});


app.post("/Userlogin", async function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  try {
    // Query for books (assuming you want to get all books)
    const products = await product.find();

    // Query for the user
    const foundUser = await User.findOne({ email: email });

    // console.log(foundUser);
    // console.log(books);
    if (foundUser) {
      if (foundUser.password == password) {
        res.render("user_profile", { user: foundUser, array: products });
      } else {
        return res.status(401).send('<script>alert("Incorrect Email or Password.");window.location.href="/login";</script>');
      }
    }
  } catch (error) {
    console.error('Error:', error);
    // Handle the error as needed
    res.status(500).send('Internal Server Error');
  }
});




app.post("/newBook", function (req, res) {
  const productID = req.body.productid;
  const status = req.body.issue_status;
  const type = req.body.product_type;
  const productName = req.body.Product_name;
  // const address = req.body.address;
  const seller = req.body.seller_name;
  const productPrice = req.body.product_price;
  // const shelf = req.body.Shelf_no;
  // const floorNo = req.body.Floor_no;
  // const sectionNo = req.body.Section_no;
  // const rowNo = req.body.Row_no;
  const email=req.body.email;

  const new_product = new product({
    productid: productID,
    status_issue: status,
    product_type: type,
    // Floor_no: floorNo,
    Product_name: productName,
    // address: address,
    seller_name: seller,
    product_price: productPrice,
    // Shelf_no: shelf,
    // Section_no: sectionNo,
    // Row_no: rowNo,
    email:email

  });

  new_product.save()
    .then(() => {
      res.redirect("/Book_Details");
    })
    .catch(err => {
      console.error("Error saving user:", err);
      // Handle the error appropriately, e.g., return an error response to the client
      res.status(500).send("Internal Server Error");
    });
});




app.post("/update_User", function (req, res) {
  const emailId = req.body.email;
  const updateFields = {};

  for (const key in req.body) {
    if (req.body.hasOwnProperty(key)) {
      updateFields[key] = req.body[key];
    }
  }
  for (const key in updateFields) {
    if (updateFields[key] === '') {
      delete updateFields[key];
    }
  }
  User.findOneAndUpdate({email:emailId},updateFields).then(function(ifupdated){
    // console.log("updated the users successfully");
  });
  res.redirect("/User_Details");

})


app.get("/delete_User/:id", function (req, res) {

  const emailId = req.params.id;
  User.findOneAndDelete({ email: emailId }).then(function(deleted){
        console.log("Deleted the user ");
  });
  res.redirect("/User_Details");
})




//for books
app.post("/update_Product", function (req, res) {

  const productId = req.body.productid;
  const updateFields = {};
  for (const key in req.body) {
    if (req.body.hasOwnProperty(key)) {
      updateFields[key] = req.body[key];
    }
  }
 console.log(updateFields);
  for (const key in updateFields) {
    if (updateFields[key] === '') {
      delete updateFields[key];
    }
  }

  console.log(updateFields);
  // console.log(bookId);
  // book.findOneAndUpdate({bookid:bookId},updateFields).then(function(ifupdated){
  //   console.log("updated the books successfully");
  // });

  async function updateProduct() {
  try {
    const updatedProduct = await product.findOneAndUpdate({ productid: productId }, updateFields, { new: true });

    if (updatedProduct) {
      // console.log('Updated the book successfully');
    } else {
      // console.log('Book not found or no changes were made');
    }
  } catch (error) {
    // console.error('An error occurred:', error);
  }
}

updateProduct();
  res.redirect("/Book_Details");

});


app.get("/delete_product/:id", function (req, res) {

  const productId = req.params.id;

  product.findOneAndDelete({ productid: productId }).then(function(deleted){
    
  });
  res.redirect("/Book_Details");

})



app.post("/ownerLogin",function(req,res){
  const Username = "gauravkatkade68@gmail.com";
  const password = "1234";
  const user=req.body.email;
  const pass=req.body.password;

  if(Username==user && password==pass)
  {
    res.redirect("/ownerProfile");
  }
  else{
    res.send("Username or Password is wrong");
  }

})

//redirecting to signin and loing pages


// app.get("/NewBook",function(req,res){
//       res.sendFile(__dirname + "/files/newbook.html");
// })

app.get("/NewBook",function(req,res){
      res.sendFile(__dirname + "/files/newbook.html");
})

app.get("/signup", function (req, res) {
  res.sendFile(__dirname + "/files/SignUp.html");
})

app.get("/login", function (req, res) {
  res.sendFile(__dirname + "/files/login.html");
})

app.get("/Ownerlogin", function (req, res) {
  res.sendFile(__dirname + "/files/Ownerlogin.html");
})

app.get("/location", function (req, res) {
  res.sendFile(__dirname + "/dbms.html")
})

app.get("/ownerProfile", function (req, res) {
  res.sendFile(__dirname + "/files/owner_profile.html")
})

app.get("/userProfile", function (req, res) {

  res.render("user_profile");
})


// app.get("/userandlocation", function (req, res) {
//   res.sendFile(__dirname + "/dbms2.html")
// })
app.get("/editDetails", function (req, res) {
  res.sendFile(__dirname + "/edit_form.html")
})

app.get("/editProductDetails",function(req,res){
  res.sendFile(__dirname + "/book_form.html")
})

app.get("/registerProduct", function (req, res) {
  res.sendFile(__dirname + "/book_form.html")
})



//user details

app.get("/User_Details", function (req, res) {
  User.find().then(function (users) {

    res.render("User_details.ejs", { array: users });
  });

})


//book details
app.get("/Book_Details", function (req, res) {

  async function findProducts(){
    const findb= await product.find().then(function (users) {

      res.render("Book_Details.ejs", { array: users });
    });

  }
  findProducts();

});


app.get("/UserProductDetails_product/:id", function (req, res) {
  const email=req.params.id;

  product.find({email:email}).then(function (foundbooks) {
   
    // console.log(foundbooks);
  if(foundbooks){
    res.render("UserBookDetails", { array: foundbooks });
  }
  else{
    res.send("No Books found . User haven't yet borrowed book ")
  }
  });

})



//starting server at port
app.listen(3000, function () {
  console.log("Server started at port 3000");
})
