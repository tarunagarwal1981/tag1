// lib/validations.ts - Form validation schemas
export const validationRules = {
    email: {
      required: 'Email is required',
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address'
      }
    },
    phone: {
      required: 'Phone number is required',
      pattern: {
        value: /^[\+]?[1-9][\d]{0,15}$/,
        message: 'Please enter a valid phone number'
      }
    },
    password: {
      required: 'Password is required',
      minLength: {
        value: 8,
        message: 'Password must be at least 8 characters'
      }
    },
    name: {
      required: 'Name is required',
      minLength: {
        value: 2,
        message: 'Name must be at least 2 characters'
      }
    }
  } as const;