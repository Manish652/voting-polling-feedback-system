import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    dob: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ["male", "female", "other", "Male", "Female"],
        required: true
    },
    phone: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/  
    },
    address: {
        vill: { type: String, required: true },
        po: { type: String, required: true },
        ps: { type: String, required: true },
        dist: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true, match: /^[0-9]{6}$/ }
    },
      avatar: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
}, { timestamps: true });

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next(); }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);};

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
