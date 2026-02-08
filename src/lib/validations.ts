import * as yup from 'yup';
import { VALIDATION } from '@/constants';

/**
 * Common validation messages
 */
export const VALIDATION_MESSAGES = {
  REQUIRED: 'Este campo es requerido',
  EMAIL_INVALID: 'Ingresa un correo electrónico válido',
  PASSWORD_MIN: `La contraseña debe tener al menos ${VALIDATION.PASSWORD_MIN_LENGTH} caracteres`,
  PASSWORD_MAX: `La contraseña no puede exceder ${VALIDATION.PASSWORD_MAX_LENGTH} caracteres`,
  PASSWORD_MATCH: 'Las contraseñas no coinciden',
  NAME_MIN: `El nombre debe tener al menos ${VALIDATION.NAME_MIN_LENGTH} caracteres`,
  NAME_MAX: `El nombre no puede exceder ${VALIDATION.NAME_MAX_LENGTH} caracteres`,
  PHONE_INVALID: 'Ingresa un número de teléfono válido',
  QUANTITY_MIN: 'La cantidad debe ser al menos 1',
  QUANTITY_MAX: 'La cantidad máxima es 99',
  RATING_RANGE: 'La calificación debe estar entre 1 y 5',
} as const;

/**
 * Login form validation schema
 */
export const loginSchema = yup.object({
  email: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .email(VALIDATION_MESSAGES.EMAIL_INVALID)
    .max(VALIDATION.EMAIL_MAX_LENGTH),
  password: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .min(VALIDATION.PASSWORD_MIN_LENGTH, VALIDATION_MESSAGES.PASSWORD_MIN)
    .max(VALIDATION.PASSWORD_MAX_LENGTH, VALIDATION_MESSAGES.PASSWORD_MAX),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;

/**
 * Forgot password form validation schema
 */
export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .email(VALIDATION_MESSAGES.EMAIL_INVALID)
    .max(VALIDATION.EMAIL_MAX_LENGTH),
});

export type ForgotPasswordFormData = yup.InferType<typeof forgotPasswordSchema>;

/**
 * Reset password form validation schema
 */
export const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .min(VALIDATION.PASSWORD_MIN_LENGTH, VALIDATION_MESSAGES.PASSWORD_MIN)
    .max(VALIDATION.PASSWORD_MAX_LENGTH, VALIDATION_MESSAGES.PASSWORD_MAX),
  confirmPassword: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .oneOf([yup.ref('password')], VALIDATION_MESSAGES.PASSWORD_MATCH),
});

export type ResetPasswordFormData = yup.InferType<typeof resetPasswordSchema>;

/**
 * Registration form validation schema
 */
export const registerSchema = yup.object({
  email: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .email(VALIDATION_MESSAGES.EMAIL_INVALID)
    .max(VALIDATION.EMAIL_MAX_LENGTH),
  password: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .min(VALIDATION.PASSWORD_MIN_LENGTH, VALIDATION_MESSAGES.PASSWORD_MIN)
    .max(VALIDATION.PASSWORD_MAX_LENGTH, VALIDATION_MESSAGES.PASSWORD_MAX),
  confirmPassword: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .oneOf([yup.ref('password')], VALIDATION_MESSAGES.PASSWORD_MATCH),
  firstName: yup
    .string()
    .optional()
    .min(VALIDATION.NAME_MIN_LENGTH, VALIDATION_MESSAGES.NAME_MIN)
    .max(VALIDATION.NAME_MAX_LENGTH, VALIDATION_MESSAGES.NAME_MAX),
  lastName: yup
    .string()
    .optional()
    .min(VALIDATION.NAME_MIN_LENGTH, VALIDATION_MESSAGES.NAME_MIN)
    .max(VALIDATION.NAME_MAX_LENGTH, VALIDATION_MESSAGES.NAME_MAX),
  // phone: yup
  //   .string()
  //   .optional()
  //   .min(VALIDATION.PHONE_MIN_LENGTH, VALIDATION_MESSAGES.PHONE_INVALID)
  //   .max(VALIDATION.PHONE_MAX_LENGTH, VALIDATION_MESSAGES.PHONE_INVALID),
});

export type RegisterFormData = yup.InferType<typeof registerSchema>;

/**
 * Profile update form validation schema
 */
export const profileSchema = yup.object({
  firstName: yup
    .string()
    .optional()
    .min(VALIDATION.NAME_MIN_LENGTH, VALIDATION_MESSAGES.NAME_MIN)
    .max(VALIDATION.NAME_MAX_LENGTH, VALIDATION_MESSAGES.NAME_MAX),
  lastName: yup
    .string()
    .optional()
    .min(VALIDATION.NAME_MIN_LENGTH, VALIDATION_MESSAGES.NAME_MIN)
    .max(VALIDATION.NAME_MAX_LENGTH, VALIDATION_MESSAGES.NAME_MAX),
  phone: yup
    .string()
    .optional()
    .min(VALIDATION.PHONE_MIN_LENGTH, VALIDATION_MESSAGES.PHONE_INVALID)
    .max(VALIDATION.PHONE_MAX_LENGTH, VALIDATION_MESSAGES.PHONE_INVALID),
});

export type ProfileFormData = yup.InferType<typeof profileSchema>;

/**
 * Address form validation schema
 */
export const addressSchema = yup.object({
  label: yup.string().required(VALIDATION_MESSAGES.REQUIRED).max(50),
  recipientName: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .min(VALIDATION.NAME_MIN_LENGTH, VALIDATION_MESSAGES.NAME_MIN)
    .max(VALIDATION.NAME_MAX_LENGTH, VALIDATION_MESSAGES.NAME_MAX),
  phone: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .min(VALIDATION.PHONE_MIN_LENGTH, VALIDATION_MESSAGES.PHONE_INVALID)
    .max(VALIDATION.PHONE_MAX_LENGTH, VALIDATION_MESSAGES.PHONE_INVALID),
  street: yup.string().required(VALIDATION_MESSAGES.REQUIRED).max(200),
  number: yup.string().optional().max(20),
  apartment: yup.string().optional().max(50),
  district: yup.string().required(VALIDATION_MESSAGES.REQUIRED).max(100),
  city: yup.string().required(VALIDATION_MESSAGES.REQUIRED).max(100),
  department: yup.string().required(VALIDATION_MESSAGES.REQUIRED).max(100),
  postalCode: yup.string().optional().max(20),
  reference: yup.string().optional().max(200),
  isDefault: yup.boolean().optional(),
});

export type AddressFormData = yup.InferType<typeof addressSchema>;

/**
 * Review form validation schema
 */
export const reviewSchema = yup.object({
  rating: yup
    .number()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .min(1, VALIDATION_MESSAGES.RATING_RANGE)
    .max(5, VALIDATION_MESSAGES.RATING_RANGE),
  title: yup.string().optional().max(VALIDATION.REVIEW_TITLE_MAX_LENGTH),
  comment: yup.string().optional().max(VALIDATION.REVIEW_COMMENT_MAX_LENGTH),
});

export type ReviewFormData = yup.InferType<typeof reviewSchema>;

/**
 * Contact form validation schema
 */
export const contactSchema = yup.object({
  name: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .min(VALIDATION.NAME_MIN_LENGTH, VALIDATION_MESSAGES.NAME_MIN)
    .max(VALIDATION.NAME_MAX_LENGTH, VALIDATION_MESSAGES.NAME_MAX),
  email: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .email(VALIDATION_MESSAGES.EMAIL_INVALID),
  subject: yup.string().required(VALIDATION_MESSAGES.REQUIRED).max(200),
  message: yup.string().required(VALIDATION_MESSAGES.REQUIRED).max(1000),
});

export type ContactFormData = yup.InferType<typeof contactSchema>;
