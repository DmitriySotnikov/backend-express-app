/**
 * @abstract
 * @class BcryptDomainService
 * @description Abstract service for password hashing and comparison using bcrypt.
 * Defines the contract for password-related cryptographic operations.
 */
export abstract class BcryptDomainService {
  /**
   * @description Hashes a plain-text password using bcrypt.
   * @param {Object} param - The parameter object containing the password to hash.
   * @param {string} param.password - The plain-text password to be hashed.
   * @returns {Promise<string>} A promise that resolves to the hashed password.
   * @throws {Error} If password hashing fails.
   */
  abstract hash(param: { password: string }): Promise<string>;

  /**
   * @description Compares a plain-text password with a stored hash.
   * @param {Object} param - The parameter object containing the password and hash.
   * @param {string} param.password - The plain-text password to verify.
   * @param {string} param.hash - The stored password hash to compare against.
   * @returns {Promise<boolean>} A promise that resolves to true if passwords match, false otherwise.
   * @throws {Error} If password comparison fails.
   */
  abstract compare(param: { password: string; hash: string }): Promise<boolean>;
}
