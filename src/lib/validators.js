/* eslint-disable no-restricted-syntax */
// empty validation
function emptyValidator(body, fieldList) {
    const errors = [];
    fieldList.forEach((key) => {
        if (!body[key].trim()) {
            errors.push(`${key} is required`);
        }
    });

    return errors;
}

// trim whitespace before saving data to the database
function trimObject(obj) {
    if (typeof obj !== 'object' || obj === null) {
        // If obj is not an object or is null, return it directly
        return obj;
    }

    // If obj is an array, map over its elements and trim them
    if (Array.isArray(obj)) {
        return obj.map(trimObject);
    }

    // Create a new object to store the trimmed key-value pairs
    const trimmedObject = {};

    // Iterate over the object's keys
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];
            // Recursively trim nested objects or arrays
            trimmedObject[key] = trimObject(value);
            // Trim string values
            if (typeof trimmedObject[key] === 'string') {
                trimmedObject[key] = trimmedObject[key].trim();
            }
        }
    }

    return trimmedObject;
}

module.exports = { emptyValidator, trimObject };
