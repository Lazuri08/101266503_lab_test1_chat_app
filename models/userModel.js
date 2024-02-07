/* Sample user schema
{
“_id”: j35nn35hjdksgjkdsgs”,
“username”: “pritamworld”,
“firstname”: “pritesh”,
“lastname”: “Patel”,
“password”: “What about covid19 vaccine?”
“createon”: “01-28-2022 18:30 PM”
} */

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
//const { isEmail } = require('validator');

const SALT_WORK_FACTOR = 10;

const userSchema = new mongoose.Schema({
    username : {
        type: String, 
        maxLength: 100,
        unique: true,
        required: [true, 'Please enter a username']
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    password: {
        type: String, 
        required: [true, 'Please enter a password'],
        minlength: [6, 'The password should be at least 6 characters long']
    },
    createdOn: {
        type: Date
    }
})

userSchema.pre('save', async function save(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

/* userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
} */

userSchema.statics.login = async function (username, password){
    const user = await this.findOne({username});
    if(user){
        const isAuthenticated = await bcrypt.compare(password,user.password);
        if(isAuthenticated){
            return user;
        }else{
            throw Error('Incorrect password');
        }
    }else{
        throw Error('Incorrect email');
    }
}
module.exports = mongoose.model("user", userSchema);