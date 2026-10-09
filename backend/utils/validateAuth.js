import validator from 'validator';

/**
 * Validate registration input fields
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {{ isValid: boolean, message?: string }}
 */
export const validateRegisterInput = (name, email, password) => {
  if (!name || !email || !password) {
    return {
      isValid: false,
      message: 'All fields (name, email, password) are required'
    };
  }

  // Validate email format
  if (!validator.isEmail(email)) {
    return {
      isValid: false,
      message: 'Please enter a valid email address'
    };
  }

  // Validate minimum password length of 8 characters
  if (password.length < 8) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters long'
    };
  }

  return { isValid: true };
};

/**
 * Validate login input fields
 * @param {string} email
 * @param {string} password
 * @returns {{ isValid: boolean, message?: string }}
 */
export const validateLoginInput = (email, password) => {
  if (!email || !password) {
    return {
      isValid: false,
      message: 'Email and password are required'
    };
  }

  if (!validator.isEmail(email)) {
    return {
      isValid: false,
      message: 'Please enter a valid email address'
    };
  }

  return { isValid: true };
};
