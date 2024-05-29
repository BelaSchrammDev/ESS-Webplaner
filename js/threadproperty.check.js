const CHECKS_ARRAY = [
    {
        value: ' G 1 ',
        result: {
            "type": 'G',
            "diameter": 33.25,
            "pitch": 2.309,
        }
    },
    {
        value: ' G 1/2 ',
        result: {
            "type": 'G',
            "diameter": 20.95,
            "pitch": 1.814,
        }
    },
    {
        value: ' G 1/2-A ',
        result: {
            "type": 'G',
            "diameter": 20.95,
            "pitch": 1.814,
        }
    },
    {
        value: ' G 1 1/2 ',
        result: {
            "type": 'G',
            "diameter": 48.000,
            "pitch": 2.309
        }
    },
    {
        value: ' G 1 1/8 ',
        result: {
            "type": 'G',
            "diameter": 37.897,
            "pitch": 2.309
        }
    },
];


/**
 * Extracts thread properties for each element in the CHECKS_ARRAY and performs a check.
 */
function extractPropertysfunctionCheck() {
    CHECKS_ARRAY.forEach(element => {
        let result = extractThreadPropertys(element.value);
        if (ifThreadPropertysRight(result, element.result)) {
            console.log("%c Test passed: " + element.value, "color: green");
        } else {
            console.error('Test failed:', element.value, 'Result:', result);
        }
    });
}


/**
 * Checks if the given thread properties match the specified test.
 *
 * @param {Object} threadPropertys - The thread properties to compare.
 * @param {Object} test - The test object containing the properties to match against.
 * @returns {boolean} - Returns true if the thread properties match the test, otherwise false.
 */
function ifThreadPropertysRight(threadPropertys, test) {
    return threadPropertys.type === test.type &&
        threadPropertys.diameter === test.diameter &&
        threadPropertys.pitch === test.pitch;
}
