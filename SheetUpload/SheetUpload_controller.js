const updateDetailDb = require('../model/UpdateDetails.model');

exports.sheetList = async (req, res, next) => {
	const { type } = req.body;
	try {
		const _data = await updateDetailDb.findOne(
			{ update: type },
		);
		res.status(200).json({
			data: {
				bondData: _data?.data,
			}
		});
	} catch (e) {
		res.status(500).json({
			error: {
				msg: 'error occured on DB!',
			}
		})
	}
}

exports.sheetUpload = async (req, res, next) => {
	const { data, type } = req.body;
	try {
		const findData = await updateDetailDb.find({ update: type });
		if (findData.length) {
			await updateDetailDb.updateOne(
				{ update: type },
				{ $set: { data: data } },
			);
		} else {
			await updateDetailDb.create({ data: data, update: type });
		}
		res.status(200).json({
			data: {
				msg: 'successfully uploaded!',
			}
		});
	} catch (e) {
		res.status(500).json({
			error: {
				msg: 'error occured on DB!',
			}
		});
	}
}
