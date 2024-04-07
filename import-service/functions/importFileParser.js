import AWS from 'aws-sdk';
import csv from 'csv-parser';

const s3 = new AWS.S3({ region: process.env.AWS_REGION });

export const importFileParser = async (event) => {
	for (const record of event.Records) {
		const s3Stream = s3
			.getObject({
				Bucket: record.s3.bucket.name,
				Key: record.s3.object.key,
			})
			.createReadStream();

		s3Stream
			.pipe(csv())
			.on('data', (data) => {
				console.log(data);
			})
			.on('end', () => {
				console.log(`Parsing for ${record.s3.object.key} finished`);
			});
	}
};
