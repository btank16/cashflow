import { fetchUserAttributes, updateUserAttributes } from 'aws-amplify/auth';
import { hasActiveSession } from './AuthUtils.Js';

/**
 * UserAttributesCache - A utility to manage user attributes in a central location.
 * 
 * This utility provides functions to:
 * - Load user attributes when the app starts
 * - Cache them for fast access throughout the app
 * - Update attributes both in the cache and in AWS Cognito
 * - Get specific attributes as needed
 */

// In-memory cache for user attributes
let userAttributesCache = null;
let isLoading = false;
let lastUpdated = null;

/**
 * Initialize the user attributes cache - fetches user attributes if there's an active session
 * @returns {Promise<Object|null>} The loaded user attributes or null if no active session
 */
export const initUserAttributesCache = async () => {
  try {
    // Check if there's an active session first
    const sessionActive = await hasActiveSession();
    if (!sessionActive) {
      userAttributesCache = null;
      return null;
    }

    return await refreshUserAttributes();
  } catch (error) {
    console.error('Error initializing user attributes cache:', error);
    userAttributesCache = null;
    return null;
  }
};

/**
 * Refresh the user attributes from AWS Cognito
 * @returns {Promise<Object|null>} The fresh user attributes or null if error
 */
export const refreshUserAttributes = async () => {
  if (isLoading) {
    // If already loading, wait for the current operation to complete
    return userAttributesCache;
  }

  isLoading = true;
  try {
    const attributes = await fetchUserAttributes();
    userAttributesCache = attributes;
    lastUpdated = new Date();
    return attributes;
  } catch (error) {
    console.error('Error refreshing user attributes:', error);
    return userAttributesCache; // Return the existing cache if refresh fails
  } finally {
    isLoading = false;
  }
};

/**
 * Get all cached user attributes
 * @param {boolean} forceRefresh - Whether to force a refresh from AWS
 * @returns {Promise<Object|null>} The user attributes or null if no cache or session
 */
export const getUserAttributes = async (forceRefresh = false) => {
  // If force refresh is requested or cache is empty, fetch fresh data
  if (forceRefresh || !userAttributesCache) {
    return await refreshUserAttributes();
  }
  return userAttributesCache;
};

/**
 * Get a specific user attribute from the cache
 * @param {string} attributeName - The name of the attribute to get
 * @param {boolean} forceRefresh - Whether to force a refresh from AWS
 * @returns {Promise<string|null>} The attribute value or null if not found
 */
export const getUserAttribute = async (attributeName, forceRefresh = false) => {
  const attributes = await getUserAttributes(forceRefresh);
  if (!attributes) return null;
  return attributes[attributeName] || null;
};

/**
 * Update user attributes both in AWS Cognito and in the local cache
 * @param {Object} attributes - The attributes to update
 * @returns {Promise<boolean>} Whether the update was successful
 */
export const updateUserAttributesWithCache = async (attributes) => {
  try {
    // Update in AWS first
    await updateUserAttributes({ userAttributes: attributes });
    
    // If AWS update succeeds, update the cache
    if (userAttributesCache) {
      userAttributesCache = { ...userAttributesCache, ...attributes };
      lastUpdated = new Date();
    } else {
      // If there's no cache yet, refresh completely
      await refreshUserAttributes();
    }
    return true;
  } catch (error) {
    console.error('Error updating user attributes:', error);
    return false;
  }
};

/**
 * Clear the user attributes cache (used for logout, etc.)
 */
export const clearUserAttributesCache = () => {
  userAttributesCache = null;
  lastUpdated = null;
};

/**
 * Check if the user attributes cache is initialized
 * @returns {boolean} Whether the cache has been initialized
 */
export const isUserAttributesCacheInitialized = () => {
  return userAttributesCache !== null;
};

/**
 * Get the time when the cache was last updated
 * @returns {Date|null} The last update time or null if never updated
 */
export const getLastUpdatedTime = () => {
  return lastUpdated;
};

export default {
  initUserAttributesCache,
  refreshUserAttributes,
  getUserAttributes,
  getUserAttribute,
  updateUserAttributesWithCache,
  clearUserAttributesCache,
  isUserAttributesCacheInitialized,
  getLastUpdatedTime
}; 