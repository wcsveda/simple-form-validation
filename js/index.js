
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

const form_names = ['first_name', 'last_name', 'phone', 'email'];
const form_lebels = ['First Name', 'Last Name', 'Phone number', 'Email address'];
const validations = [];

function addValidation(index, validator, errorFormatter) {
    validations.push(() => validateField(form_names[index], errorFormatter(form_lebels[index], form_names[index]), validator));
}
function addEmptyCheck(index) {
    addValidation(index, s => !isEmpty(s), s => `${s} cannot be empty`);
}
function addBasicCheck(index, min_len, max_len) {
    addEmptyCheck(index);
    addValidation(index, s => !isShort(s, min_len), s => `${s} cannot be shorter than ${min_len} charators`);
    addValidation(index, s => !isLong(s, max_len), s => `${s} cannot be longer than ${max_len} charators`);
}

addBasicCheck(0, 3, 32);
addBasicCheck(1, 3, 32);
addBasicCheck(2, 10, 13);

addEmptyCheck(3);
addValidation(3, email => !(/^\w{3,}@\w{3,}\\.\w{2,4}$/.test(email)), () => "invalid email address");

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