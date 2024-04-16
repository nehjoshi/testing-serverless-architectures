const mongoose = require('mongoose')
const validateEmail = email => {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};
const Quiz1Schema = new mongoose.Schema({
    result: Number,
    lastQ: {
        type: Number,
        default: 0
    },
    resultDesc: String,
    finished: Boolean
});
const Quiz2Schema = new mongoose.Schema({
    result1: Number,
    result2: Number,
    result3: Number,
    result4: Number,
    result: String,
    resultDesc: String,
    lastQ: {
        type: Number,
        default: 0
    },
    finished: Boolean
});
const Quiz3Schema = new mongoose.Schema({
    pmb: Number,
    pvb: Number,
    psb: Number,
    pmg: Number,
    pvg: Number,
    psg: Number,
    optScore: Number,
    hopeScore: Number,
    esteemScore: Number,
    optDesc: String,
    hopeDesc: String,
    esteemDesc: String,
    lastQ: Number,
    finished: Boolean
});
const Quiz4Schema = new mongoose.Schema({
    E: Number,
    A: Number,
    C: Number,
    N: Number,
    O: Number,
    E_score: Number,
    A_score: Number,
    C_score: Number,
    N_score: Number,
    O_score: Number,
    E_desc: String,
    A_desc: String,
    C_desc: String,
    N_desc: String,
    O_desc: String,
    lastQ: Number,
    finished: Boolean
});
const Quiz5Schema = new mongoose.Schema({
    P: Number,
    E: Number,
    R: Number,
    M: Number,
    A: Number,
    N: Number,
    HAP: Number,
    H: Number,
    LON: Number,
    lastQ: Number,
    PERMA: Number,
    finished: Boolean
});
const reg1Schema = new mongoose.Schema({
    dob: String,
    weight: Number,
    height: Number,
    glasses: String,
    nationality: String,
    religion: String,
    smoke: String,
    drink: String,
    hobbies: String,
    physicalConditions: String,
    childhoodIllnesses: String
});
const reg2Schema = new mongoose.Schema({
    q1: Number,
    q2: Number,
    q3: Number,
    q4: Number,
    q5: Number,
    q6: Number,
    q7: Number,
    q8: Number,
    q9: Number,
    q10: Number,
    q11: Number,
    q12: Number,
})
const schema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please enter a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    name: {
        type: String,
    },
    password: {
        type: String,
    },
    userAgreesWithPrivacyPolicy: {
        type: Boolean,
        default: false
    },
    quiz1: {
        type: Quiz1Schema,
        default: {
            lastQ: 1,
            result: 0,
            resultDesc: "",
            finished: false
        }
    },
    quiz2: {
        type: Quiz2Schema,
        default: {}
    },
    quiz3: {
        type: Quiz3Schema,
        default: {}
    },
    quiz4: {
        type: Quiz4Schema,
        default: {}
    },
    quiz5: {
        type: Quiz5Schema,
        default: {}
    },
    reg1: {
        type: reg1Schema,
        default: {}
    },
    reg2: {
        type: reg2Schema,
        default: {}
    },
    choseToSkipDetails: Boolean,
    completed: {
        type: Boolean,
        required: false,
        default: false
    },
    resetToken: {
        type: String,
        required: false,
        expires: 60
    }
}, {timestamps: true, collection: 'Users'});

const model = mongoose.model('User', schema);
module.exports = model;