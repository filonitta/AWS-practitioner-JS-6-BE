export const generateToken = async (event, context) => {
	// get all env variables
	const env = process.env;
	let token;

	const user = 'filonitta';
	const password = env[user];

	// "username:password" is encoded in Base64 to generate the token
	const base64Credentials = Buffer.from(`${user}:${password}`, 'utf-8').toString('base64');

	if (!token) {
		token = `Basic ${base64Credentials}`;
	} else {
		token = `${token}, Basic ${base64Credentials}`;
	}

	return {
		statusCode: 200,
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Credentials': true,
		},
		body: JSON.stringify({
			token: `Basic ${base64Credentials}`,
		}),
	};
};
