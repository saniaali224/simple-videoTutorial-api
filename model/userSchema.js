const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		
		video: {
			type: String,
			default: '',
		},
	},
	{
		timestamps: true,
	},
);
const User = mongoose.model("user", userSchema);

module.exports = User;

