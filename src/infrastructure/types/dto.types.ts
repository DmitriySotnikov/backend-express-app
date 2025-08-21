/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface SignInDto {
  /**
   * @format email
   * @example "admin@example.com"
   */
  email: string;
  /**
   * @format password
   * @example "strongpassword123"
   */
  password: string;
  /** @example "unique-device-id-abcde" */
  deviceId: string;
}

export interface SignUpDto {
  /** @example "John" */
  firstname: string;
  /** @example "Doe" */
  lastname: string;
  /** @example "Smith" */
  surname: string;
  /**
   * @format date
   * @example "1990-01-01"
   */
  birthDate: string;
  /**
   * @format email
   * @example "user@example.com"
   */
  email: string;
  /**
   * @format password
   * @example "strongpassword123"
   */
  password: string;
  /** @example "unique-device-identifier-12345" */
  deviceId: string;
  /**
   * Roles to be assigned to the user. Must be from the allowed list.
   * @example ["USER"]
   */
  roleNames: ("USER" | "ADMIN")[];
}

export interface SuccessAuthResponseDto {
  /**
   * A short-lived JSON Web Token for accessing protected resources.
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   */
  accessToken: string;
  /**
   * A long-lived token stored in an HTTP-only cookie, used to obtain a new access token.
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   */
  refreshToken: string;
}

export interface LogoutResponseDto {
  /** @example "Successfully logged out" */
  message: string;
}

export interface ErrorResponse {
  /** @example 500 */
  statusCode?: number;
  /** @example "Internal Server Error" */
  message?: string;
}

export interface SuccessMessageResponse {
  /** @example "Operation completed successfully" */
  message?: string;
}

export interface UserRoleResponse {
  /** @example 1 */
  id?: number;
  /** @example "ADMIN" */
  name?: string;
}

export interface UserResponseDto {
  /** @example 123 */
  id?: number;
  /**
   * @format email
   * @example "user@example.com"
   */
  email?: string;
  /** @example "John" */
  firstname?: string;
  /** @example "Doe" */
  lastname?: string;
  /** @example "Smith" */
  surname?: string;
  /**
   * @format date
   * @example "1990-01-01"
   */
  birthDate?: string;
  /** @example false */
  isBanned?: boolean;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
  roles?: UserRoleResponse[];
}

export type UserListResponseDto = UserResponseDto[];
