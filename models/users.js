import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userId: {
    type: String,
    unique: true,
    immutable: true,
  },
firstName :{
    type:String,
    required: true,
    immutable: true,

},
lastName:{
   type:String,
    required: true,
    immutable: true,

},

guardianType:{
    type:String,
    enum:["Mother","Father","Guardian"],
   required: function() {
      return this.role === "Student" && this.classLevel !== "Adult";
    } 
},
guardianName :{
    type:String,
    required: true,
    required: function() {
      return this.role === "Student" && this.classLevel !== "Adult";
    } 
  
},
classLevel:{
    type: String, 
    enum: [ "Grade 11","Grade 12","Grade 13","Adult"], 
    required: function() {
      return this.role === "Student";
    } 
  
},
address: { 
    type: String },


gender:{
    type:String,
    enum:["Male","Female","Other"],
    required:true,
},


guardianPhoneNo:{
    type:String,
    match: [/^[0-9]{10}$/, "Please enter valid phone number"],  
    required: function() {
      return this.role === "Student" && this.classLevel !== "Adult";
    }   
},
phoneNo:{
    type:String,
    required:true,
    unique:true,
   match: [/^[0-9]{10}$/, "Please enter valid phone number"],
   
},
email:{
    type:String,
    required:true,
    unique:true,
     trim:true,
    lowercase:true,
     match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
   
},
password:{
    type:String,
    required: true,
    minlength:8,
    maxlength:64,
},

role :{
    type:String,
    enum:["Student", "Teacher","Admin","Payment Manager","Assistant"],
    required:true,
    immutable: true,
},
isBlocked:{
    type:Boolean,
    default:false,
},
profilePic:{
    type:String,
    default:"https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
},
isPhoneVerified:{
    type:Boolean,
    default:false,
},

isEmailVerified:{
    type:Boolean,
    default:false,
},

notifications: {
  email: { type: Boolean, default: true },
  sms: { type: Boolean, default: false },
},

paymentHistory: [
  {
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" },
    method: { type: String, enum: [ "onlineBankTransfer","BankTransfer", "Cash"] },
    transactionId: { type: String ,index:true, required: function() {
      return this.role === "Student";
    } },
   
  }
  
]

})

const User = mongoose.model("users",userSchema);
export default User;