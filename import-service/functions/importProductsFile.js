import AWS from 'aws-sdk';

const s3 = new AWS.S3({ region: process.env.REGION, signatureVersion: 'v4' });

export const importProductsFile = async (event) => {
	console.info('queryStringParameters', event.queryStringParameters);

	const { name } = event.queryStringParameters;

	const params = {
		Bucket: process.env.BUCKET,
		Key: `${process.env.UPLOAD_FOLDER}/${name}`,
		Expires: 60, // Signed URL will be valid for 60 seconds
		ContentType: 'text/csv',
	};

	try {
		const signedUrl = await s3.getSignedUrlPromise('putObject', params);

		return {
			statusCode: 200,
			body: JSON.stringify(signedUrl),
			// headers: {
			// 	'Access-Control-Allow-Origin': '*',
			// 	'Access-Control-Allow-Credentials': true,
			// },
		};
	} catch (error) {
		return {
			statusCode: 500,
			body: 'Failed to generate signed URL',
		};
	}
};
