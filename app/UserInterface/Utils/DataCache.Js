/**
 * DataCache - A utility to cache expenses and calculations locally to reduce API calls.
 * 
 * This utility provides functions to:
 * - Cache expenses and calculations data locally
 * - Sync the cache with CRUD operations
 * - Get all items sorted by updatedAt
 * - Clear the cache when needed
 * - React hooks for components to easily access data
 */

import { useState, useEffect, useCallback } from 'react';
import { getExpensesByUserId, getCalculationsByUserId } from './AmplifyDataUtils.Js';

// In-memory caches
let expensesCache = null;
let calculationsCache = null;

// Cache status tracking
let expensesLastUpdated = null;
let calculationsLastUpdated = null;
let isExpensesLoading = false;
let isCalculationsLoading = false;

/**
 * Initialize both data caches
 * @returns {Promise<{expenses: Array, calculations: Array}>} The loaded data
 */
export const initDataCache = async () => {
  try {
    const expenses = await refreshExpensesCache();
    const calculations = await refreshCalculationsCache();
    
    return {
      expenses,
      calculations
    };
  } catch (error) {
    console.error('Error initializing data cache:', error);
    return {
      expenses: expensesCache || [],
      calculations: calculationsCache || []
    };
  }
};

/**
 * Refresh the expenses cache from API
 * @returns {Promise<Array>} The fresh expenses data
 */
export const refreshExpensesCache = async () => {
  if (isExpensesLoading) {
    return expensesCache || [];
  }
  
  isExpensesLoading = true;
  try {
    const expenses = await getExpensesByUserId();
    // Sort by updatedAt in descending order (newest first)
    expensesCache = expenses.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    expensesLastUpdated = new Date();
    return expensesCache;
  } catch (error) {
    console.error('Error refreshing expenses cache:', error);
    return expensesCache || [];
  } finally {
    isExpensesLoading = false;
  }
};

/**
 * Refresh the calculations cache from API
 * @returns {Promise<Array>} The fresh calculations data
 */
export const refreshCalculationsCache = async () => {
  if (isCalculationsLoading) {
    return calculationsCache || [];
  }
  
  isCalculationsLoading = true;
  try {
    const calculations = await getCalculationsByUserId();
    // Sort by updatedAt in descending order (newest first)
    calculationsCache = calculations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    calculationsLastUpdated = new Date();
    return calculationsCache;
  } catch (error) {
    console.error('Error refreshing calculations cache:', error);
    return calculationsCache || [];
  } finally {
    isCalculationsLoading = false;
  }
};

/**
 * Get expenses from cache, refreshing if needed, optionally filtered by calculator type
 * @param {string} [calculatorType] - Optional calculator type to filter by
 * @param {boolean} [forceRefresh=false] - Whether to force a refresh from API
 * @returns {Promise<Array>} The expenses data
 */
export const getExpenses = async (calculatorType, forceRefresh = false) => {
  if (forceRefresh || !expensesCache) {
    await refreshExpensesCache();
  }
  
  // If no calculator type specified, return all expenses
  if (!calculatorType) {
    return expensesCache || [];
  }
  
  // Filter by calculator type
  return (expensesCache || []).filter(expense => {
    try {
      const applicableCalculators = JSON.parse(expense.applicable_calculators || '[]');
      return applicableCalculators.includes(calculatorType);
    } catch (e) {
      console.error('Error parsing applicable_calculators:', e);
      return false;
    }
  });
};

/**
 * Get calculations from cache, refreshing if needed, optionally filtered by calculator type
 * @param {string} [calculatorType] - Optional calculator type to filter by
 * @param {boolean} [forceRefresh=false] - Whether to force a refresh from API
 * @returns {Promise<Array>} The calculations data
 */
export const getCalculations = async (calculatorType, forceRefresh = false) => {
  if (forceRefresh || !calculationsCache) {
    await refreshCalculationsCache();
  }
  
  // If no calculator type specified, return all calculations
  if (!calculatorType) {
    return calculationsCache || [];
  }
  
  // Filter by calculator type
  return (calculationsCache || []).filter(calc => calc.calculator_type === calculatorType);
};

/**
 * Get a calculation by ID from the cache
 * @param {string} id - Calculation ID to find
 * @returns {Promise<Object|null>} The calculation or null if not found
 */
export const getCalculationById = async (id) => {
  if (!calculationsCache) {
    await refreshCalculationsCache();
  }
  return (calculationsCache || []).find(calc => calc.id === id) || null;
};

/**
 * Get an expense by ID from the cache
 * @param {string} id - Expense ID to find
 * @returns {Promise<Object|null>} The expense or null if not found
 */
export const getExpenseById = async (id) => {
  if (!expensesCache) {
    await refreshExpensesCache();
  }
  return (expensesCache || []).find(expense => expense.id === id) || null;
};

/**
 * Update the expenses cache after creating a new expense
 * @param {Object} newExpense - The newly created expense
 */
export const addExpenseToCache = (newExpense) => {
  if (!expensesCache) {
    expensesCache = [newExpense];
  } else {
    expensesCache = [newExpense, ...expensesCache];
  }
  expensesLastUpdated = new Date();
};

/**
 * Update the calculations cache after creating a new calculation
 * @param {Object} newCalculation - The newly created calculation
 */
export const addCalculationToCache = (newCalculation) => {
  if (!calculationsCache) {
    calculationsCache = [newCalculation];
  } else {
    calculationsCache = [newCalculation, ...calculationsCache];
  }
  calculationsLastUpdated = new Date();
};

/**
 * Update the expenses cache after updating an expense
 * @param {Object} updatedExpense - The updated expense
 */
export const updateExpenseInCache = (updatedExpense) => {
  if (!expensesCache) return;
  
  expensesCache = expensesCache.map(expense => 
    expense.id === updatedExpense.id ? updatedExpense : expense
  );
  
  // Resort the array after update
  expensesCache.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  expensesLastUpdated = new Date();
};

/**
 * Update the calculations cache after updating a calculation
 * @param {Object} updatedCalculation - The updated calculation
 */
export const updateCalculationInCache = (updatedCalculation) => {
  if (!calculationsCache) return;
  
  calculationsCache = calculationsCache.map(calculation => 
    calculation.id === updatedCalculation.id ? updatedCalculation : calculation
  );
  
  // Resort the array after update
  calculationsCache.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  calculationsLastUpdated = new Date();
};

/**
 * Update the expenses cache after deleting an expense
 * @param {string} expenseId - The ID of the deleted expense
 */
export const removeExpenseFromCache = (expenseId) => {
  if (!expensesCache) return;
  
  expensesCache = expensesCache.filter(expense => expense.id !== expenseId);
  expensesLastUpdated = new Date();
};

/**
 * Update the calculations cache after deleting a calculation
 * @param {string} calculationId - The ID of the deleted calculation
 */
export const removeCalculationFromCache = (calculationId) => {
  if (!calculationsCache) return;
  
  calculationsCache = calculationsCache.filter(calculation => calculation.id !== calculationId);
  calculationsLastUpdated = new Date();
};

/**
 * Clear all caches (used for logout, etc.)
 */
export const clearDataCache = () => {
  expensesCache = null;
  calculationsCache = null;
  expensesLastUpdated = null;
  calculationsLastUpdated = null;
};

/**
 * Get the time when the expense cache was last updated
 * @returns {Date|null} The last update time or null if never updated
 */
export const getExpensesLastUpdated = () => {
  return expensesLastUpdated;
};

/**
 * Get the time when the calculation cache was last updated
 * @returns {Date|null} The last update time or null if never updated
 */
export const getCalculationsLastUpdated = () => {
  return calculationsLastUpdated;
};

/**
 * React hook to get cached expenses with automatic refresh
 * @param {string} [calculatorType] - Optional calculator type to filter by
 * @param {boolean} [initialFetch=true] - Whether to fetch data on mount
 * @returns {Object} Object containing expenses, loading state, and refresh function
 */
export const useExpenses = (calculatorType = null, initialFetch = true) => {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(initialFetch);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  // Memoize the fetch function to prevent unnecessary re-creation
  const fetchExpenses = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);
    try {
      // Only pass forceRefresh=true when explicitly requested
      // This will avoid unnecessary API calls when the cache is sufficient
      const data = await getExpenses(calculatorType, forceRefresh);
      setExpenses(data || []);
      setLastUpdated(getExpensesLastUpdated());
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [calculatorType]);

  // Initial fetch on mount if requested
  useEffect(() => {
    let isMounted = true;
    
    if (initialFetch) {
      // For initial fetch, don't force refresh from the cloud
      // This will use the cache if available
      fetchExpenses(false).then(() => {
        // Only update state if component is still mounted
        if (!isMounted) return;
      });
    }
    
    // Clean up function to prevent memory leaks
    return () => {
      isMounted = false;
    };
  }, [initialFetch, fetchExpenses]);

  // Memoize the refresh function to maintain consistent reference
  const refreshExpensesCallback = useCallback((forceRefresh = false) => {
    return fetchExpenses(forceRefresh);
  }, [fetchExpenses]);

  return {
    expenses,
    isLoading,
    lastUpdated,
    error,
    // Expose method to fetch from cache (default) or force refresh from API
    refreshExpenses: refreshExpensesCallback
  };
};

/**
 * React hook to get cached calculations with automatic refresh
 * @param {string} [calculatorType] - Optional calculator type to filter by
 * @param {boolean} [initialFetch=true] - Whether to fetch data on mount
 * @returns {Object} Object containing calculations, loading state, and refresh function
 */
export const useCalculations = (calculatorType = null, initialFetch = true) => {
  const [calculations, setCalculations] = useState([]);
  const [isLoading, setIsLoading] = useState(initialFetch);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  // Memoize the fetch function to prevent unnecessary re-creation
  const fetchCalculations = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);
    try {
      // Only pass forceRefresh=true when explicitly requested
      // This will avoid unnecessary API calls when the cache is sufficient
      const data = await getCalculations(calculatorType, forceRefresh);
      setCalculations(data || []);
      setLastUpdated(getCalculationsLastUpdated());
    } catch (err) {
      console.error('Error fetching calculations:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [calculatorType]);

  // Initial fetch on mount if requested
  useEffect(() => {
    let isMounted = true;
    
    if (initialFetch) {
      // For initial fetch, don't force refresh from the cloud
      // This will use the cache if available
      fetchCalculations(false).then(() => {
        // Only update state if component is still mounted
        if (!isMounted) return;
      });
    }
    
    // Clean up function to prevent memory leaks
    return () => {
      isMounted = false;
    };
  }, [initialFetch, fetchCalculations]);

  // Memoize the refresh function to maintain consistent reference
  const refreshCalculationsCallback = useCallback((forceRefresh = false) => {
    return fetchCalculations(forceRefresh);
  }, [fetchCalculations]);

  return {
    calculations,
    isLoading,
    lastUpdated,
    error,
    // Expose method to fetch from cache (default) or force refresh from API
    refreshCalculations: refreshCalculationsCallback
  };
};

export default {
  // Cache initialization and management
  initDataCache,
  refreshExpensesCache,
  refreshCalculationsCache,
  clearDataCache,
  
  // Data retrieval
  getExpenses,
  getCalculations,
  getExpenseById,
  getCalculationById,
  
  // Cache update functions
  addExpenseToCache,
  updateExpenseInCache,
  removeExpenseFromCache,
  addCalculationToCache,
  updateCalculationInCache,
  removeCalculationFromCache,
  
  // Status information
  getExpensesLastUpdated,
  getCalculationsLastUpdated,
  
  // React hooks
  useExpenses,
  useCalculations
}; 