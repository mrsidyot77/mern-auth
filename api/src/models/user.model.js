
import mongoose,{Schema} from "mongoose";
import bcrpt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    username : {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
        trim: true,
        index: true
    },
    email:{
        type: String,
        lowercase: true,
        unique: true,
        required: true,
        trim: true,
        index: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String,
        default:
        'https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg',
    },
    coverImage: {
        type: String,
    },
    password: {
        type: String,
        required: [true,"Password is required."]
        
    },
    refreshToken : {
        type: String,
    }
},{timestamps: true})

// Encrypt password
userSchema.pre("save", async function (next){ //mongoose provides prehook  
    if (!this.isModified("password")) return next() // Ensure the password is only updated if it has been modified, otherwise, retain the current password.


    this.password = await bcrpt.hash(this.password,14)  // Hashing the password
    next()
})

// Decrypt password to varify the user
userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrpt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email : this.email,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User",userSchema)