/* eslint-disable no-plusplus */
const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
};

// Personal information

// --------------------------------------------------------

// create height array function
function createHeightArray() {
    const heights = [];
    for (let feet = 4; feet <= 7; feet++) {
        for (let inches = 0; inches <= 11; inches++) {
            if (feet === 7 && inches > 0) {
                heights.push('more than 7 feet');
                break; // Maximum height reached
            }
            const heightStr = inches === 0 ? `${feet}'` : `${feet}' ${inches}"`;
            heights.push(heightStr);
        }
    }
    heights.unshift('less than 4 feet');
    return heights;
}

const heightArray = createHeightArray();

// handle weights functionality
function createWeightOption() {
    const weights = [];

    for (let i = 30; i < 120; i++) {
        const weightStr = `${i} kg`;
        weights.push(weightStr);
    }
    weights.unshift('less than 30 kg');
    weights.push('more than 120 kg');

    return weights;
}

const weightOptions = createWeightOption();

// complexion options
const complexionOptions = ['black', 'brown', 'lightBrown', 'fair', 'veryFair'];

// type of biodata
const biodataTypes = ['groom', 'bride'];

// marital status
const maritalStatus = ['single', 'married', 'divorced', 'widowed', 'separated'];

// blood groups
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// ------------------------------------------------------------

// Educational

// ------------------------------------------------------------

// education medium options
const medium = ['general', 'qawmi', 'alia'];

// education qualification options
const educationOptions = [
    'belowSSC',
    'SSC',
    'HSC',
    'diplomaRunning',
    'diploma',
    'undergraduate',
    'graduate',
    'postGraduate',
    'doctorate',
];

// category options
const categories = ['science', 'commerce', 'arts', 'vocational'];

// result options
const resultOptions = ['A+', 'A', 'A-', 'B', 'C', 'D'];

// ------------------------------------------------------------

// Family information, Lifestyle and Occupation

// ------------------------------------------------------------

// alive option
const aliveOption = ['Yes, Alive', 'Not Alive'];

// alive option
const fiqhOption = ['hanafi', 'maliki', 'shafi', 'hanbali', 'ahleHadis'];

// occurrence option
const occurrenceOption = [
    'imam',
    'madrasaTeacher',
    'teacher',
    'doctor',
    'engineer',
    'businessman',
    'governmentGob',
    'privateJob',
    'freelancer',
    'student',
    'expatriate',
    'others',
    'noProfession',
];

// ------------------------------------------------------------

module.exports = {
    options,
    educationOptions,
    medium,
    categories,
    resultOptions,
    biodataTypes,
    maritalStatus,
    heightArray,
    complexionOptions,
    weightOptions,
    bloodGroups,
    aliveOption,
    fiqhOption,
    occurrenceOption,
};
