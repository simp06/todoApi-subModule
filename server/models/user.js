const validator = require('validator');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const {ObjectID}= require('mongodb');

var UserSchema= new mongoose.Schema({
	 email:{
	 	type:String,
	 	required:true,
	 	minlength:1,
	 	trim:true,
	 	unique:true,
	 	validate:{
	 		validator:validator.isEmail,
	 		message:'{VALUE} is not valid email'
	 	}
	 },
	 password:{
	 	type:String,
	 	required:true,
	 	minlength:6,
	 	trim:true
	 },
	 tokens:[{
	 	access:{
	 		type:String,
	 		required:true
	 	},
	 	token:{
	 		type:String,
	 		required:true
	 	}
	 }],
	 
});

UserSchema.methods.toJSON = function(){
	var user = this;
	var userObject = user.toObject();

	return _.pick(userObject,['_id','email']);
};
UserSchema.methods.generateAuthToken = function(){
	var user = this;
	var access = 'auth';
	var hexId = new ObjectID(user.id);
	var token = jwt.sign({_id:hexId.toHexString(),access},'abc123').toString();

	user.tokens.push({access: access, token: token});

	return user.save().then(()=>{
		return token ;
	});
};
var User = mongoose.model('Users',UserSchema);

module.exports = {User};