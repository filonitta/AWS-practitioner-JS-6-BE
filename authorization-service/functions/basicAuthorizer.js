// export const basicAuthorizer = async (event, context, callback) => {
// 	if (event.type !== 'TOKEN') callback('Unauthorized');

// 	const token = event.authorizationToken;

// 	console.log('token', token);
// 	if (!token) {
// 		return {
// 			statusCode: 401,
// 			body: 'Unauthorized',
// 		};
// 	}

// 	try {
// 		const base64Credentials = token.split(' ')[1];
// 		const [username, password] = Buffer.from(base64Credentials, 'base64')
// 			.toString('utf-8')
// 			.split(':');

// 		const storedUserPassword = process.env[username];
// 		const effect = !storedUserPassword || storedUserPassword !== password ? 'Deny' : 'Allow';

// 		// const policy = generatePolicy(username, event.methodArn, effect);
// 		// callback(null, policy);
// 		// const response = generatePolicy(username, event.methodArn, effect);

// 		// // Add the CORS headers to the response
// 		// response.headers = {
// 		// 	'Access-Control-Allow-Origin': '*',
// 		// 	'Access-Control-Allow-Credentials': true,
// 		// };

// 		// callback(null, response);

// 		callback(null, {
// 			statusCode: 200,
// 			headers: {
// 				'Access-Control-Allow-Origin': '*',
// 				'Access-Control-Allow-Credentials': true,
// 			},
// 			body: JSON.stringify(generatePolicy(username, event.methodArn, effect)),
// 		});

// 		// return policy;
// 	} catch (error) {
// 		console.error('Error authorizing user:', error);

// 		return {
// 			statusCode: 500,
// 			body: 'Internal server error',
// 		};
// 		// callback(`Unauthorized: ${error.message}`);
// 	}
// };

// const generatePolicy = (principalId, resource, effect) => {
// 	if (effect === 'Deny') {
// 		return {
// 			statusCode: 403,
// 			body: 'Forbidden',
// 		};
// 	}

// 	return {
// 		principalId,
// 		policyDocument: {
// 			Version: '2012-10-17',
// 			Statement: [
// 				{
// 					Action: 'execute-api:Invoke',
// 					Effect: effect,
// 					Resource: resource,
// 				},
// 			],
// 		},
// 	};
// };

/* export const basicAuthorizer = async (event, context, callback) => {
	console.log('Event: ', event);

	if (event.type !== 'TOKEN') {
		console.log('Expected "event.type" parameter to have value "TOKEN", received:', event.type);
		return generatePolicy('user', 'Deny', event.methodArn);
	}

	const token = event.authorizationToken;
	if (!token) {
		return callback('Unauthorized');
	}

	const base64Credentials = token.split(' ')[1];
	const [username, password] = Buffer.from(base64Credentials, 'base64')
		.toString('utf-8')
		.split(':');

	// Check if the credentials match any environment variables
	const storedUserPassword = process.env[username];
	const effect = !storedUserPassword || storedUserPassword !== password ? 'Deny' : 'Allow';

	const policy = generatePolicy(username, event.methodArn, effect);

	return policy;
};

const generatePolicy = (principalId, resource, effect) => {
	return {
		principalId: principalId,
		policyDocument: {
			Version: '2012-10-17',
			Statement: [
				{
					Action: 'execute-api:Invoke',
					Effect: effect,
					Resource: resource,
				},
			],
		},
	};
}; */

export const basicAuthorizer = async (event, context) => {
	console.log('Event: ', event);

	if (event.type !== 'TOKEN') {
		console.log('Expected "event.type" parameter to have value "TOKEN", received:', event.type);
		return generatePolicy('user', 'Deny', event.methodArn);
	}

	const token = event.authorizationToken;

	if (!token) {
		throw new Error('Unauthorized');
	}

	const base64Credentials = token.split(' ')[1];
	const [username, password] = Buffer.from(base64Credentials, 'base64').toString().split(':');

	// Check if the credentials match any environment variables
	const storedUserPassword = process.env[username];
	const effect = !storedUserPassword || storedUserPassword !== password ? 'Deny' : 'Allow';

	const policy = generatePolicy(username, event.methodArn, effect);

	return policy;
};

const generatePolicy = (principalId, resource, effect) => {
	return {
		principalId: principalId,
		policyDocument: {
			Version: '2012-10-17',
			Statement: [
				{
					Action: 'execute-api:Invoke',
					Effect: effect,
					Resource: resource,
				},
			],
		},
	};
};
