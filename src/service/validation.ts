const validation = {
    EMAIL_VALIDATION: {
        required: "Email is required",
        pattern: {
            value: /\S+@\S{3,}\.\S{2,}/,
            message: "Enter a valid email",
        },
    },
    // The password must include at least one lowercase letter, one uppercase letter, one digit, one special character, and be at least 6 characters long.
    PASSWORD_VALIDATION: (required) => {
        return {
            required: `${required}`,
            minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
            },
            validate: {
                hasUppercase: (value) =>
                    /[A-Z]/.test(value) ||
                    "Password must contain at least one uppercase letter",
                hasLowercase: (value) =>
                    /[a-z]/.test(value) ||
                    "Password must contain at least one lowercase letter",
                hasNumber: (value) =>
                    /\d/.test(value) ||
                    "Password must contain at least one number",
                hasSpecialChar: (value) =>
                    /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                    "Password must contain at least one special character",
            },
        };
    },
    CONFIRM_PASSWORD_VALIDATION: (getValues, newPassword) => {
        return {
            required: "Confirm Password is required",
            validate: (value) =>
                value === getValues(newPassword) || "Passwords do not match",
        };
    },
};

export default validation;
