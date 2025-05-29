import { getCurrentUser, fetchUserAttributes, fetchAuthSession } from 'aws-amplify/auth';

// Function to check if a session exists before running authentication checks
export const hasActiveSession = async () => {
  try {
    const session = await fetchAuthSession();
    return !!session?.tokens?.idToken;
  } catch (error) {
    console.log('No active session found:', error);
    return false;
  }
};

// Helper function to extract names from a full name string (for Apple Sign In)
const extractNamesFromFullName = (fullName) => {
  if (!fullName) return { firstName: '', lastName: '' };
  
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    // Only one word, use it as the first name
    return { firstName: parts[0], lastName: '' };
  } else {
    // First word is first name, everything else combined is last name
    const firstName = parts[0];
    const lastName = parts.slice(1).join(' ');
    return { firstName, lastName };
  }
};

// Function to check if a user is a first-time OAuth user
export const checkIsFirstTimeUser = async () => {
  try {
    // First check if there's an active session to avoid unnecessary errors
    const sessionActive = await hasActiveSession();
    if (!sessionActive) {
      return {
        isAuthenticated: false,
        isFirstTimeUser: false,
        isOAuthUser: false,
        attributes: {}
      };
    }
    
    // Get current user
    const currentUser = await getCurrentUser();
    
    // Fetch user attributes to check if this is a first-time OAuth sign-in
    const userAttributes = await fetchUserAttributes();
    
    // Check if this is an OAuth user by looking for identities attribute
    const isOAuthUser = userAttributes.identities ? true : false;
    
    // Check for custom attributes first
    let hasFirstName = !!userAttributes['custom:firstName'];
    let hasLastName = !!userAttributes['custom:lastName'];
    
    // If custom attributes aren't set, check OAuth provider attributes
    if (!hasFirstName || !hasLastName) {
      // Check Google style attributes
      if (userAttributes.given_name) {
        hasFirstName = true;
      }
      
      if (userAttributes.family_name) {
        hasLastName = true;
      }
      
      // Check Apple style attributes (single name field)
      if (!hasFirstName || !hasLastName) {
        if (userAttributes.name) {
          const { firstName, lastName } = extractNamesFromFullName(userAttributes.name);
          hasFirstName = !!firstName;
          hasLastName = !!lastName;
        }
      }
    }
    
    // Check if required profile fields are missing
    const isFirstTimeUser = !hasFirstName || 
                           !hasLastName ||
                           !userAttributes['custom:origin_state'] ||
                           !userAttributes['custom:interest_state'] ||
                           !userAttributes['custom:invest_strategy'];
    
    return {
      isAuthenticated: true,
      isFirstTimeUser,
      isOAuthUser,
      email: userAttributes.email,
      userId: currentUser.userId,
      attributes: userAttributes
    };
  } catch (error) {
    return {
      isAuthenticated: false,
      isFirstTimeUser: false,
      isOAuthUser: false,
      attributes: {}
    };
  }
};

// Function to direct user to the appropriate screen based on auth status
export const handleOAuthRedirect = async (navigation) => {
  try {
    // First check if there's an active session
    const sessionActive = await hasActiveSession();
    if (!sessionActive) {
      return false;
    }
    
    const authStatus = await checkIsFirstTimeUser();
    const { isAuthenticated, isFirstTimeUser, isOAuthUser } = authStatus;
    
    if (isAuthenticated) {
      // Determine where to send the user based on their status
      if (isOAuthUser && isFirstTimeUser) {
        // New OAuth user - send to SignUpThird to complete profile
        navigation.reset({
          index: 0,
          routes: [{ name: 'SignUpThird', params: { isOAuthUser: true } }],
        });
        return true;
      } else {
        // Existing user - send directly to home
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main', params: { screen: 'CalcHomeScreen' } }],
        });
        return true;
      }
    }
    return false;
  } catch (error) {
    return false;
  }
};

// Function to manually check auth and redirect 
export const forceCheckAuthAndRedirect = async (navigation) => {
  try {
    // First check if there's an active session to avoid unnecessary errors
    const sessionActive = await hasActiveSession();
    if (!sessionActive) {
      return false;
    }
    
    // Get authentication status
    const authStatus = await checkIsFirstTimeUser();
    
    if (authStatus.isAuthenticated) {
      // Skip navigation if it's not provided (used for checks without navigation)
      if (!navigation) {
        return true;
      }
      
      // User is authenticated, direct them appropriately
      if (authStatus.isFirstTimeUser) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'SignUpThird', params: { isOAuthUser: true } }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main', params: { screen: 'CalcHomeScreen' } }],
        });
      }
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

/**
 * Retrieves the current authenticated user if available
 * @returns {Promise<AuthUser|null>} The current authenticated user or null
 */
export const getAuthenticatedUser = async () => {
  try {
    const user = await getCurrentUser();
    return user;
  } catch (error) {
    console.log('No authenticated user found:', error);
    return null;
  }
};

/**
 * Handles automatic login when app is launched or resumed
 * @param {function} navigationCallback - Optional callback for custom navigation
 * @returns {Promise<boolean>} True if auto login was successful
 */
export const handleAutoLogin = async (navigationCallback = null) => {
  try {
    // Check if we have an active session
    const isSessionActive = await hasActiveSession();
    
    if (isSessionActive) {
      // Get the current user information
      const user = await getAuthenticatedUser();
      
      // If we have both an active session and user information, we're properly authenticated
      if (user) {
        console.log('Auto login successful for user:', user.username);
        
        // Navigate the user if a navigation callback is provided
        if (navigationCallback) {
          navigationCallback(user);
        }
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Error during auto login:', error);
    return false;
  }
}; 