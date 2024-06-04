'use strict';

const aws = require("aws-sdk");
const AWS_REGION = process.env.region;
aws.config.update({region: AWS_REGION});
exports.aws = aws;
exports.AWS_REGION = AWS_REGION;

const https = require('https');
exports.https = https;

const MS_PER_MINUTE = 60000;
exports.MS_PER_MINUTE = MS_PER_MINUTE;

const logging = true;
const no_logging = false;
exports.logging = logging;
exports.no_logging = no_logging;

const cors = true;
const no_cors = false;
exports.cors = cors;
exports.no_cors = no_cors;

const empty_string = "";
exports.empty_string = empty_string;

const blank_date = " ";
exports.blank_date = blank_date;


const ticket_priority = {
    normal: "normal"    
}
exports.ticket_priority = ticket_priority;


exports.httpsRequest = async function(method, {body, ...options}) {
    return new Promise((resolve,reject) => {
    const req = https.request({
        method: method,
        port: 443,
        ...options,
    }, res => {
        const chunks = [];
        res.on('data', data => chunks.push(data))
        res.on('end', () => {
        let body = Buffer.concat(chunks);
//console.log('httpsRequest: ' + body.toString());
        /*switch(res.headers['content-type']) {
            case 'application/json':
            body = JSON.parse(JSON.stringify(body));
            break;
        };*/
        resolve(body);
        })
    })
    req.on('error', reject);
    if(body) {
        req.write(body);
    }
    req.end();
    })    
};

exports.build_response = function(calling_function, status_code, status_message = "ok", cors = false, include_executed_version = false, logging = false) {
console.log ("Build_response - status_mesage:\n" + status_message);
console.log ("Object: ");
console.log (typeof status_message);
    var return_data = {
        "statusCode": status_code,    
        "body": typeof status_message === 'object' ? JSON.stringify(status_message, null, 2) : status_message, // if fed json then stringify, if fed text then just put in body
        //"body": status_message,
        "headers": {
            "Content-Type": typeof status_message === 'object' ?  "application/json": "text/html",  // if error just return it as text
        }
    }

    if (cors) return_data.headers = {        
        "Access-Control-Allow-Origin": "*",
        'Access-Control-Allow-Credentials': true,
        "Content-Type": "application/json"
    }  

    if (include_executed_version) return_data.ExecutedVersion = "$LATEST"

    // See if we need to log the return data, will always status codes 400+
    if (status_code <= 399 && logging == true) console.log(`${calling_function} - ${JSON.stringify(return_data, null, 2)}`);
    else if (status_code >= 400) console.error(`${calling_function} - ${JSON.stringify(return_data, null, 2)}`);
    
    return return_data;
}

exports.capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

exports.isNumber = function(value) {
    //return typeof value === 'number' && isFinite(value) && !isNaN(value);
    return (typeof value == "number" && !isNaN(value));
}

exports.isStringNumber = function(value) {
    return (!isNaN(value));
}

exports.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
 };

exports.isJSON = function(item) {
    item = typeof item !== "string"
        ? JSON.stringify(item)
        : item;

    try {
        item = JSON.parse(item);
    } catch (e) {
        return false;
    }

    if (typeof item === "object" && item !== null) {
        return true;
    }

    return false;
}

exports.isObject = function(item) {    
    return (!!item) && (item.constructor === Object);
}

module.exports.isObject = function(a) {
    return (!!a) && (a.constructor === Object);
};

exports.jsonObjLength = (obj) => {
    return Object.keys(obj).length;
}

exports.isEmptyObject = (obj) => {
    return !Object.keys(obj).length;
}

exports.returnJSONObjectKeys = (object, logResult = false) => { // Only one level the parent keys
    const functionName = "returnJSONObjectKeys";   
   
    var keys = [];
    for(let i of [object]){        
        const keyList = (Object.keys(i)).toString();       
        keys.push(keyList.split(","));    // if you want as an array      
    }

    return keys[0]; // don't want double array return just the first as an array of keys
}

module.exports.sortObject = (obj) => {
    return Object.keys(obj).sort().reduce(function (result, key) {
        result[key] = obj[key];
        return result;
    }, {});
}

module.exports.sortByKey = (array, key) => {
    return array.sort(function(a, b) {
        var x = a[key];
        var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

module.exports.findTag = (tagList, tagToFind, logResult = false) => {
    const functionName = "findTag";
    const Logging = logResult;

    var found = false;

    if (tagList && tagList.length > 0 && tagToFind) {        
        if (tagList.find(element => element == tagToFind)) found = true;
    } else found = false;

    if (Logging) console.info(`${functionName}() - tagToFind ${tagToFind}, tagList: ${JSON.stringify(tagList, null, 2)}, was found = ${found}`);
    return found;
}

exports.removeDuplicatesFromArray = (array) => {
    return array.filter((x, i) => i === array.indexOf(x));
}

exports.jsonStringify = (an_object) => {    // https://stackoverflow.com/questions/11616630/how-can-i-print-a-circular-structure-in-a-json-like-format
    var cache = [];
    var string = JSON.stringify(an_object, (key, value) => {
        if (typeof value === 'object' && value !== null) {
        // Duplicate reference found, discard key
        if (cache.includes(value)) return;

        // Store value in our collection
        cache.push(value);
        }
        return value;
    }, 2);
    cache = null; // Enable garbage collection

    return string;
}

exports.replaceAll = (str, find, replace) => {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

// Private functions

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}