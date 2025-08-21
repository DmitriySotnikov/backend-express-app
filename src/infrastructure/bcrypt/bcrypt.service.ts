import * as bcrypt from 'bcrypt';
import { BcryptDomainService } from '../../domain/services/bcrypt.service';

/**
 * @class BcryptService
 * @description Infrastructure implementation of the BcryptDomainService.
 * Provides password hashing and comparison using the bcrypt algorithm.
 * @implements {BcryptDomainService}
 */
export class BcryptService implements BcryptDomainService {
  /**
   * @description Number of salt rounds for password hashing.
   * Determines the complexity of the hash generation.
   * @private
   * @readonly
   * @type {number}
   */
  private readonly saltRounds = 10;

  /**
   * @description Hashes a plain-text password using bcrypt.
   * @param {Object} params - The parameter object containing the password to hash.
   * @param {string} params.password - The plain-text password to be hashed.
   * @returns {Promise<string>} A promise that resolves to the hashed password.
   * @throws {Error} If password hashing fails.
   */
  public async hash({ password }: { password: string }): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  /**
   * @description Compares a plain-text password with a stored hash.
   * @param {Object} params - The parameter object containing the password and hash.
   * @param {string} params.password - The plain-text password to verify.
   * @param {string} params.hash - The stored password hash to compare against.
   * @returns {Promise<boolean>} A promise that resolves to true if passwords match, false otherwise.
   * @throws {Error} If password comparison fails.
   */
  public async compare({
    password,
    hash,
  }: {
    password: string;
    hash: string;
  }): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
