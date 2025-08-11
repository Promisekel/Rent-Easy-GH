// Simple validation functions (no external dependencies)
const isEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isEmpty = (value: string): boolean => {
    return !value || value.trim().length === 0;
};

interface ValidationData {
    [key: string]: any;
}

interface ValidationErrors {
    [key: string]: string;
}

interface ValidationResult {
    isValid: boolean;
    errors: ValidationErrors;
}

export const validateRegistration = (data: ValidationData): ValidationResult => {
    const errors: ValidationErrors = {};

    if (isEmpty(data.name)) {
        errors.name = 'Name is required';
    }

    if (isEmpty(data.email)) {
        errors.email = 'Email is required';
    } else if (!isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }

    if (isEmpty(data.password)) {
        errors.password = 'Password is required';
    } else if (data.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
};

export const validateLogin = (data: ValidationData): ValidationResult => {
    const errors: ValidationErrors = {};

    if (isEmpty(data.email)) {
        errors.email = 'Email is required';
    } else if (!isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }

    if (isEmpty(data.password)) {
        errors.password = 'Password is required';
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
};

export const validateListing = (data: ValidationData): ValidationResult => {
    const errors: ValidationErrors = {};

    if (isEmpty(data.title)) {
        errors.title = 'Title is required';
    }

    if (isEmpty(data.price)) {
        errors.price = 'Price is required';
    } else if (isNaN(data.price)) {
        errors.price = 'Price must be a number';
    }

    if (isEmpty(data.location)) {
        errors.location = 'Location is required';
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
};