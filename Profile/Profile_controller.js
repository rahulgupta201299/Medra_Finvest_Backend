const profileDb = require('../model/Profile.model');
const otpDb = require('../model/Otp.model');
const Axios = require('axios');

exports.userSignUp = async (req, res, next) => {
	const { firstName, lastName, mobile: phoneNumber, email, password } = req.body;
	try {
		const userFoundWithMobile = await profileDb.findOne({ phoneNumber });
		const userFoundWithEmail = await profileDb.findOne({ email });
		if (userFoundWithEmail && userFoundWithMobile) {
			res.status(200).json({
				statusCode: 200,
				msg: 'You already have an account. Please Login!',
			})
		} else if (userFoundWithEmail) {
			await profileDb.updateOne({ email }, { phoneNumber, firstName, lastName, password });
			res.status(200).json({
				statusCode: 200,
				msg: 'Mobile No. updated for this registered email. Please Login!',
			})
		} else if (userFoundWithMobile) {
			await profileDb.updateOne({ phoneNumber }, { email, firstName, lastName, password });
			res.status(200).json({
				statusCode: 200,
				msg: 'Email updated for this registered mobile no. Please Login!',
			})
		} else {
			await profileDb.create({ 
				firstName,
				lastName,
				phoneNumber,
				email,
				password,
			 })
			res.status(201).json({
				statusCode: 201,
				msg: 'Successfully Registered. Please Login!',
			})
		}
	} catch (e) {
		res.status(500).json({
			statusCode: 500,
			msg: 'Something Went Wrong!',
		})
	}
}

exports.userLogin = async (req, res, next) => {
	const { type, mobile: phoneNumber = '', email = '', password = '' } = req.body;
	if (type === "mobileLogin") {
		try {
			const userFoundWithMobile = await profileDb.find({ phoneNumber });
			if (userFoundWithMobile?.length) {
				const _data = {
					firstName: userFoundWithMobile[0].firstName,
					lastName: userFoundWithMobile[0].lastName,
					email: userFoundWithMobile[0].email,
					phoneNumber: userFoundWithMobile[0].phoneNumber,
				};
				res.status(200).json({
					login: true,
					data: _data,
					msg: `Welcome back ${userFoundWithMobile[0].firstName}!`
				});
			} else {
				res.status(200).json({
					login: false,
					msg: `No record Found. Please Register!`
				});
			}
		} catch (e) {
			console.log(e);
			res.status(500).json({
				msg: `Something went wrong!`,
			});
		}
	} else {
		try {
			const userFoundWithEmail = await profileDb.find({ email });
			if (userFoundWithEmail?.length) {
				if (userFoundWithEmail[0].password !== password) {
					res.status(200).json({
						login: false,
						incorrectPassword: true,
						msg: `Incorrect Password!`,
					});
					return;
				}
				const _data = {
					firstName: userFoundWithEmail[0].firstName,
					lastName: userFoundWithEmail[0].lastName,
					email: userFoundWithEmail[0].email,
					phoneNumber: userFoundWithEmail[0].phoneNumber,
				};
				res.status(200).json({
					login: true,
					data: _data,
					msg: `Welcome back ${userFoundWithEmail[0].firstName}!`,
				});
			} else {
				res.status(200).json({
					login: false,
					msg: `No record Found. Please Register!`,
				});
			}
		} catch (e) {
			res.status(500).json({
				msg: `Something went wrong!`,
			});
		}
	}

}

exports.findMobileNumber = async (req, res, next) => {
	const phoneNumber = req.params.mobile;
	try {
		const userFoundWithMobile = await profileDb.find({ phoneNumber });
		if (userFoundWithMobile?.length) {
			res.status(200).json({
				found: true,
				msg: `Found data for ${phoneNumber}!`,
			});
		} else {
			res.status(200).json({
				found: false,
				msg: `No record Found. Please Register!`,
			});
		}
	} catch (e) {
		res.status(500).json({
			msg: `Something went wrong!`,
		});
	}
}

exports.sendOtp = async (req, res, next) => {
	const { mobile: phoneNumber } = req.body;
	const otp = Math.floor(100000 + Math.random() * 900000);
	const headers = {
		'authorization': '4Pis8alMQ2KvDouv9i7tIKWwJ0QvWR9s2fkBCRu2wKd1Ip8gPhBtUsIJHMlp',
		'Content-Type': 'application/json',
	}
	const data = {
		variables_values: otp.toString(),
		route: 'otp',
		numbers: phoneNumber,
	}
	try {
		await Axios.post('https://www.fast2sms.com/dev/bulkV2', data, { headers: headers });

		const userFoundWithMobile = await otpDb.findOneAndUpdate({ phoneNumber }, { otp }, { new: true });
		if (!userFoundWithMobile) await otpDb.create({ phoneNumber, otp });
		res.json({
			msg: 'OTP Sent Successfully!',
		});
	} catch (e) {
		res.json({
			msg: 'Send Otp Fails! Try Again.',
		});
	}
}

exports.verifyOtp = async (req, res, next) => {
	const { mobile: phoneNumber, otp } = req.body;
	try {
		const data = await otpDb.findOne({ phoneNumber });
		if (data?.otp === otp) {
			await otpDb.findOneAndDelete({ phoneNumber });
			res.json({
				verify: true,
				msg: 'OTP Verified!',
			});
		} else {
			res.json({
				verify: false,
				msg: 'Incorrect OTP!',
			});
		}
		
	} catch (e) {
		res.json({
			otpSent: false,
			msg: 'Something went wrong!',
		});
	}
}