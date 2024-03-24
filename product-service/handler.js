'use strict';

module.exports.getProductsList = async (event) => {
	return {
		statusCode: 200,
		body: JSON.stringify([
			{
				name: 'ProductOne',
				price: 2.4,
				currency: '$',
				image: 'https://via.placeholder.com/150',
			},
		]),
	};
};
