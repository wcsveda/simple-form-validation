let form;

const fields = {
    first_name: {
        label: 'First Name',
        min_len: 3,
        max_len: 32
    },
    last_name: {
        label: 'Last Name',
        min_len: 3,
        max_len: 32
    },
    phone: {
        label: 'Phone Number',
        min_len: 10,
        max_len: 13,
        validations: [
            {
                validator: s => /^\d+$/.test(s),
                msgOnError: 'only numbers are allowed'
            }
        ]
    },
    email: {
        label: 'Email address',
        validations: [
            {
                validator: s => /^\w{3,}@\w{3,}\.\w{2,4}$/.test(s),
                msgOnError: 'invalid email address'
            }
        ]
    },
}

function setError(name, msgOnError) {
    const field = fields[name];

    if (!field.errorSpan)
        field.errorSpan = document.getElementById(name.concat('_error'));

    field.errorSpan.innerHTML = msgOnError
}

function invokeValidations(name, value, validations) {
    for (const validation of validations) {
        if (!validation.validator(value)) {
            setError(name, validation.msgOnError);
            return false;
        }
        return true;
    }
}

function performChecks(name) {
    const str = form[name].value,
        field = fields[name],
        min_len = field.min_len,
        max_len = field.max_len;

    if (!str || str.trim().length == 0)
        setError(name, `${field.label} cannot be empty`);
    else if ((min_len || min_len === 0) && str.length < min_len)
        setError(name, `${field.label} cannot be shorter than ${min_len} charators`);
    else if ((max_len || max_len === 0) && str.length > max_len)
        setError(name, `${field.label} cannot be longer than ${max_len} charators`);
    else if(field.validations && !invokeValidations(name, str, field.validations)) {
        // setting error is handled by  invokeValidations
    } else
        return true;

    return false;
}

const names = Object.keys(fields);

function clear() {
    names.forEach(k => setError(k, ''));
}

function validate() {
    try {
        if (!form) {
            form = document.forms[0];
            form.addEventListener('reset', clear);
        }

        clear();
        for (const name of names) {
            if (!performChecks(name))
                return false;
        }
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}