import { firebase } from "./utils/firebase/config.js";

/**
 * Class representing authentication functionalities.
 */
export class Authentication {
  /**
   * Create a new Authentication instance.
   * @param {Object} auth - The authentication service instance.
   */
  constructor(auth) {
    this.auth = auth;
  }

  /**
   * Creates a new user with the provided user data.
   * @param {Object} userData - The user data to create the user with.
   * @returns {Promise<Array>} - A promise that resolves to an array containing a boolean indicating success and either the user UID or an error message.
   */
  async createUser(userData) {
    try {
      const userRecord = await this.auth.createUser(userData);
      return [true, userRecord.uid];
    } catch (error) {
      return [false, error.message];
    }
  }

  /**
   * Generates an email verification link for the provided email.
   * @param {string} email - The email to generate the verification link for.
   * @returns {string} - The generated email verification link.
   */
  verificationEmail(email) {
    return this.auth.generateEmailVerificationLink(email);
  }

  /**
   * Logs in a user with the provided email and password.
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   * @returns {Promise<Array>} - A promise that resolves to an array containing a boolean indicating success and either the user UID or an error message.
   */
  async loginUser(email, password) {
    try {
      const userRecord = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      return [true, userRecord.user.uid];
    } catch (error) {
      return [false, error.message];
    }
  }

  /**
   * Updates the user with the provided UID with the given data.
   * @param {string} uid - The user's UID.
   * @param {Object} updateUserData - The data to update the user with.
   * @returns {Promise<Array>} - A promise that resolves to an array containing a boolean indicating success and either the updated user data or an error message.
   */
  async updateUser(uid, updateUserData) {
    try {
      const userRecord = await this.auth.updateUser(uid, updateUserData);
      return [true, userRecord.toJSON()];
    } catch (error) {
      return [false, error.message];
    }
  }

  /**
   * Retrieves the user data for the user with the provided UID.
   * @param {string} uid - The user's UID.
   * @returns {Promise<Array>} - A promise that resolves to an array containing a boolean indicating success and either the user data or an error message.
   */
  async getUser(uid) {
    try {
      const user = await this.auth.getUser(uid);
      return [true, user];
    } catch (error) {
      return [false, error.message];
    }
  }

  /**
   * Deletes the user with the provided UID.
   * @param {string} uid - The user's UID.
   * @returns {Promise<Array>} - A promise that resolves to an array containing a boolean indicating success and either the deleted user's UID or an error message.
   */
  async deleteUser(uid) {
    try {
      await this.auth.deleteUser(uid);
      return [true, uid];
    } catch (error) {
      return [false, error.message];
    }
  }

  /**
   * Creates a phone verification session cookie for the provided phone number.
   * @param {string} phoneNumber - The phone number to create the verification session cookie for.
   * @returns {Promise<Array>} - A promise that resolves to an array containing a boolean indicating success and either the verification request or an error message.
   */
  async createPhoneVerification(phoneNumber) {
    try {
      const request = await this.auth.createSessionCookie(phoneNumber, {
        expiresIn: 3600,
      });
      return request;
    } catch (error) {
      return [false, error.message];
    }
  }

  /**
   * Verifies the phone verification session cookie with the provided verification ID and OTP.
   * @param {string} verificationId - The verification session cookie ID.
   * @param {string} otp - The one-time password (OTP) for verification.
   * @returns {Promise<Array>} - A promise that resolves to an array containing a boolean indicating success and either the user credentials or an error message.
   */
  async verifyPhoneVerification(verificationId, otp) {
    try {
      const userCreds = await this.auth.verifySessionCookie(
        verificationId,
        otp
      );
      return userCreds;
    } catch (error) {
      return [false, error.message];
    }
  }

  /**
   * Sends a password reset email to the provided email address.
   * @param {string} email - The email address to send the password reset email to.
   * @returns {Promise<Array>} - A promise that resolves to an array containing a boolean indicating success and either the reset request or an error message.
   */
  async resetPassword(email) {
    try {
      const request = await this.auth.sendPasswordResetEmail(email);
      return request;
    } catch (error) {
      return [false, error.message];
    }
  }

  /**
   * Retrieves a list of all users.
   * @returns {Promise<Array>} - A promise that resolves to an array containing a boolean indicating success and either the list of users or an error message.
   */
  async getUsers() {
    try {
      const listUsersResult = await this.auth.listUsers();
      const users = await Promise.all(
        listUsersResult.users.map(async (userRecord) => {
          let userData;
          try {
            const fs = new Firestore("users", userRecord.uid);
            userData = await fs.read();
          } catch {
            userData = { error: "No user data found" };
          }
          return {
            ...userRecord, // Include default user data
            ...userData, // Include additional user data from Firestore
          };
        })
      );
      return users;
    } catch (error) {
      return [false, error.message];
    }
  }

  /**
   * Generates HTML content for email verification.
   * @param {string} url - The verification URL.
   * @returns {string} - HTML content for email verification.
   */
  emailVerification(url) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification - CivicCircle</title>
        <style>
            /* Add your custom CSS styles here */
        </style>
    </head>
    <body>
        <div style="background-color: #f3f4f6; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                <h1 style="color: #333333; font-size: 24px; font-weight: bold; margin-bottom: 20px;">Verify Your Email Address</h1>
                <p style="color: #666666; font-size: 16px; margin-bottom: 30px;">Thank you for signing up for CivicCircle! To complete your registration, please verify your email address by clicking the button below:</p>
                <a href="${url}" style="display: inline-block; background-color: #007bff; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-size: 16px; font-weight: bold;">Verify Email Address</a>
                <p style="color: #666666; font-size: 14px; margin-top: 30px;">If you did not sign up for an account on CivicCircle, you can safely ignore this email.</p>
            </div>
        </div>
    </body>
    </html>`;
  }
}
