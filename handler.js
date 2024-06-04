'use strict';

const common = require('./common');

//const util = require('util');

const logging = common.logging;
const no_logging = common.no_logging;

module.exports.getOrders = async event => {
  const functionName = "getOrders()";
  const Logging = logging; // set logging
  var userId = 0;
  if (Logging) console.log(`${functionName} - event ${JSON.stringify(event, null, 2)}`);  // Log the input event payload to the cloudwatch   
    
  if (!event || !event.queryStringParameters || !event.queryStringParameters.userId) return common.build_response(functionName, 400, `Missing querystring userId`); 
  if (event.queryStringParameters && event.queryStringParameters.userId) {
    if (Logging) console.log(`${functionName} - event.queryStringParameters.userId ${event.queryStringParameters.userId}`);
    userId = event.queryStringParameters.userId;    
  }

  const order_info = {
    userId: userId,
    orders: [
      {
        Id: 'ABC',
        OrderDate: "2023-11-29 00:00:01.001",
        ShipDate: "2023-11-30 00:00.01.001",
        TotalItems: 1,
        TotalCost: 1.00,
        Items: [
          {
            Id: 12345,
            Name: "Widget #001",
            Cost: 1.00,
            Quantity: 1,
            ExtendedCost: 1.00
          }
        ],   
      }
    ]
  }

  if (Logging) console.info(`${functionName}: UserId: ${userId} details ${JSON.stringify(order_info, null, 2)}`);
 
  //return common.build_response(functionName, 200, JSON.stringify(order_info, null, 2), common.cors);
  return common.build_response(functionName, 200, order_info, common.cors);
};