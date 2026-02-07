import type { UserRole } from '@/constants';
import type { BaseEntity } from './common';

/**
 * User entity
 */
export interface User extends BaseEntity {
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  role: UserRole;
  isActive: boolean;
}

/**
 * User profile (without sensitive data)
 */
export type UserProfile = Omit<User, 'isActive'>;

/**
 * Address entity
 */
export interface Address extends BaseEntity {
  userId: string;
  label: string;
  recipientName: string;
  phone: string;
  street: string;
  number: string | null;
  apartment: string | null;
  district: string;
  city: string;
  department: string;
  postalCode: string | null;
  reference: string | null;
  isDefault: boolean;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration data
 */
export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

/**
 * Auth response from API
 */
export interface AuthResponse {
  access_token: string;
  user: User;
}

/**
 * Update profile data
 */
export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

/**
 * Create address data
 */
export interface CreateAddressData {
  label: string;
  recipientName: string;
  phone: string;
  street: string;
  number?: string;
  apartment?: string;
  district: string;
  city: string;
  department: string;
  postalCode?: string;
  reference?: string;
  isDefault?: boolean;
}

/**
 * Update address data
 */
export type UpdateAddressData = Partial<CreateAddressData>;
