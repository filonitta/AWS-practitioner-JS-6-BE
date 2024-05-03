const EVENT_TYPE = 'TOKEN';

export const basicAuthorizer = async (event, context, callback) => {
	console.log('Event: ', event);

	if (event.type !== EVENT_TYPE) {
		console.info(
			`Expected "event.type" parameter to have value "${EVENT_TYPE}", received:`,
			event.type
		);
		return generatePolicy('user', 'Deny', event.methodArn);
	}

	const token = event.authorizationToken;

	console.log('token', token);
	if (!token) {
		// return generatePolicy('user', 'Deny', '*');
		callback('Unauthorized');
	}

	const base64Credentials = token.split(' ')[1];
	const [username, password] = Buffer.from(base64Credentials, 'base64').toString().split('=');

	console.log('username, password', username, password);
	const storedUserPassword = process.env[username];
	const effect = !storedUserPassword || storedUserPassword !== password ? 'Deny' : 'Allow';

	const policy = generatePolicy(username, event.methodArn, effect);

	// return policy;
	callback(null, policy);
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
