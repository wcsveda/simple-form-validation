
function isEmpty(str) {
    return !str || str.trim().length == 0;
}
function isShort(str, len) {
    return str.length < len;
}
function isLong(str, len) {
    return str.length > len;
}

let _form;

function form() {
    if (!_form)
        _form = document.forms[0];
    return _form;
}

function validateField(name, msgOnError, validator) {
    const input = form()[name];
    if (!validator(input.value)) {
        setError(name, msgOnError);
        return false;
    }
    return true;
}

function setError(name, msgOnError) {
    document.getElementById(name.concat('_error')).innerHTML = msgOnError
}

const FIRST_NAME = 0,
    LAST_NAME = 1,
    PHONE = 2,
    EMAIL = 3;

const form_names = ['first_name', 'last_name', 'phone', 'email'];
const form_lebels = ['First Name', 'Last Name', 'Phone number', 'Email address'];
const validations = [];

function addValidation(index, validator, errorFormatter) {
    validations.push(() => validateField(form_names[index], errorFormatter(form_lebels[index], form_names[index]), validator));
}
function addCheck(index, min_len, max_len) {
    addValidation(index, s => !isEmpty(s), s => `${s} cannot be empty`);

    if (min_len || min_len === 0)
        addValidation(index, s => !isShort(s, min_len), s => `${s} cannot be shorter than ${min_len} charators`);
    if (max_len || max_len === 0)
        addValidation(index, s => !isLong(s, max_len), s => `${s} cannot be longer than ${max_len} charators`);
}

//Magic Numbers
addCheck(FIRST_NAME, 3, 32);
addCheck(LAST_NAME, 3, 32);
addCheck(PHONE, 10, 13);

addCheck(EMAIL);
addValidation(EMAIL, email => !(/^\w{3,}@\w{3,}\\.\w{2,4}$/.test(email)), () => "invalid email address");

let errorSpans;
function clear() {
    if (!errorSpans)
        errorSpans = form_names.map(s => document.getElementById(s.concat("_error")));
    errorSpans.forEach(s => s.innerHTML = '');
}

form().addEventListener('reset', clear);

function validate() {
    clear();
    for (const validator of validations) {
        if (!validator())
            return false;
    }
    return true;
}