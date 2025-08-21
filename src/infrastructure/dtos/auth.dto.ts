import Joi from 'joi';

/**
 * @openapi
 * components:
 *   schemas:
 *     SignInDto:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - deviceId
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: admin@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: strongpassword123
 *         deviceId:
 *           type: string
 *           example: unique-device-id-abcde
 *
 *     SignUpDto:
 *       type: object
 *       required:
 *         - firstname
 *         - lastname
 *         - surname
 *         - birthDate
 *         - email
 *         - password
 *         - deviceId
 *         - roleNames
 *       properties:
 *         firstname:
 *           type: string
 *           example: John
 *         lastname:
 *           type: string
 *           example: Doe
 *         surname:
 *           type: string
 *           example: Smith
 *         birthDate:
 *           type: string
 *           format: date
 *           example: "1990-01-01"
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: strongpassword123
 *         deviceId:
 *           type: string
 *           example: unique-device-identifier-12345
 *         roleNames:
 *           type: array
 *           description: Roles to be assigned to the user. Must be from the allowed list.
 *           items:
 *             type: string
 *             enum: [USER, ADMIN]
 *           example: ["USER"]
 *
 *     SuccessAuthResponseDto:
 *       type: object
 *       required:
 *         - accessToken
 *         - refreshToken
 *       properties:
 *         accessToken:
 *           type: string
 *           description: "A short-lived JSON Web Token for accessing protected resources."
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         refreshToken:
 *           type: string
 *           description: "A long-lived token stored in an HTTP-only cookie, used to obtain a new access token."
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *
 *     LogoutResponseDto:
 *       type: object
 *       required:
 *         - message
 *       properties:
 *         message:
 *           type: string
 *           example: "Successfully logged out"
 */

export const signInSchema = Joi.object({
  email: Joi
    //
    .string()
    .email()
    .required()
    .messages({
      'string.empty': 'Email cannot be empty',
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is required',
    }),
  password: Joi.string()
    //
    .min(6)
    .required()
    .messages({
      'string.empty': 'Password cannot be empty',
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required',
    }),
  deviceId: Joi
    //
    .string()
    .required()
    .min(3)
    .max(50)
    .messages({
      'string.empty': 'Device ID cannot be empty ',
      'any.required': 'Device ID is required',
      'string.min': 'Device ID must be at least 3 characters long',
      'string.max': 'Device ID must be at most 50 characters long',
    }),
});

export const signUpSchema = Joi.object({
  email: Joi
    //
    .string()
    .email()
    .required()
    .messages({
      'string.email': 'Email must be a valid email address',
      'string.empty': 'Email is required',
      'any.required': 'Email is required',
    }),
  password: Joi
    //
    .string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.empty': 'Password is required',
      'any.required': 'Password is required',
    }),
  deviceId: Joi
    //
    .string()
    .required()
    .messages({
      'string.empty': 'Device ID is required',
      'any.required': 'Device ID is required',
    }),
  firstname: Joi
    //
    .string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'First name cannot be empty',
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name must be at most 50 characters long',
      'any.required': 'First name is required',
    }),
  lastname: Joi
    //
    .string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Last name cannot be empty',
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name must be at most 50 characters long',
      'any.required': 'Last name is required',
    }),
  surname: Joi
    //
    .string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Surname cannot be empty',
      'string.min': 'Surname must be at least 2 characters long',
      'string.max': 'Surname must be at most 50 characters long',
    }),
  birthDate: Joi
    //
    .string()
    .isoDate()
    .required()
    .messages({
      'string.isoDate':
        'Birth date must be a valid ISO date string (YYYY-MM-DD)',
    }),
  roles: Joi
    //
    .array()
    .items(Joi.object({ name: Joi.string().required() })) // Assuming roles are objects with a 'name' property
    .messages({
      'array.base': 'Roles must be an array',
      'array.items': "Each role must be an object with a 'name' property",
    }),
});
