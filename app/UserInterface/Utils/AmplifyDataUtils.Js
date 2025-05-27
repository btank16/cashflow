import { generateClient } from 'aws-amplify/api';
import { getUserId } from './UserAttributesCache.Js';
import {
  addCalculationToCache,
  updateCalculationInCache,
  removeCalculationFromCache,
  addExpenseToCache,
  updateExpenseInCache,
  removeExpenseFromCache,
} from './DataCache.Js';

// Generate a GraphQL API client
const client = generateClient(
  {
    authMode: 'userPool'
  }
);

// Calculation CRUD Operations
export async function createCalculation(calculatorType, inputValues, results) {
  try {
    const userId = await getUserId();
    
    // Use direct GraphQL mutation
    const createMutation = /* GraphQL */ `
      mutation CreateCalculation($input: CreateCalculationInput!) {
        createCalculation(input: $input) {
          id
          user_id
          calculator_type
          input_values
          results
          createdAt
          updatedAt
        }
      }
    `;
    
    const result = await client.graphql({
      query: createMutation,
      variables: {
        input: {
          user_id: userId,
          calculator_type: calculatorType,
          input_values: JSON.stringify(inputValues),
          results: JSON.stringify(results)
        }
      }
    });
    
    // Add to cache after successful creation
    addCalculationToCache(result.data.createCalculation);
    
    console.log('Calculation created successfully:', result.data.createCalculation.id);
    return result.data.createCalculation;
  } catch (error) {
    console.error('Error in createCalculation:', error);
    throw error;
  }
}

export async function updateCalculation(id, calculatorType, inputValues, results) {
  try {
    const updateMutation = /* GraphQL */ `
      mutation UpdateCalculation($input: UpdateCalculationInput!) {
        updateCalculation(input: $input) {
          id
          user_id
          calculator_type
          input_values
          results
          createdAt
          updatedAt
        }
      }
    `;
    
    const result = await client.graphql({
      query: updateMutation,
      variables: {
        input: {
          id: id,
          calculator_type: calculatorType,
          input_values: JSON.stringify(inputValues),
          results: JSON.stringify(results)
        }
      }
    });
    
    // Update in cache after successful update
    updateCalculationInCache(result.data.updateCalculation);
    
    return result.data.updateCalculation;
  } catch (error) {
    console.error('Error in updateCalculation:', error);
    throw error;
  }
}

export async function deleteCalculation(id) {
  try {
    const deleteMutation = /* GraphQL */ `
      mutation DeleteCalculation($input: DeleteCalculationInput!) {
        deleteCalculation(input: $input) {
          id
        }
      }
    `;
    
    const result = await client.graphql({
      query: deleteMutation,
      variables: {
        input: {
          id: id
        }
      }
    });
    
    // Remove from cache after successful deletion
    removeCalculationFromCache(id);
    
    return result.data.deleteCalculation;
  } catch (error) {
    console.error('Error in deleteCalculation:', error);
    throw error;
  }
}

export async function getCalculationsByUserId() {
  try {
    const userId = await getUserId();
    
    const listByUserIdQuery = /* GraphQL */ `
      query ListCalculationsByUserId($user_id: String!) {
        listCalculationByUser_id(user_id: $user_id) {
          items {
            id
            user_id
            calculator_type
            input_values
            results
            createdAt
            updatedAt
          }
        }
      }
    `;
    
    const result = await client.graphql({
      query: listByUserIdQuery,
      variables: {
        user_id: userId
      }
    });
    
    return result.data.listCalculationByUser_id.items;
  } catch (error) {
    console.error('Error in getCalculationsByUserId:', error);
    throw error;
  }
}

// Expense CRUD Operations
export async function createExpense(category, cost, frequency, applicableCalculators) {
  try {
    const userId = await getUserId();
    
    const createMutation = /* GraphQL */ `
      mutation CreateExpense($input: CreateExpenseInput!) {
        createExpense(input: $input) {
          id
          user_id
          category
          cost
          frequency
          applicable_calculators
          createdAt
          updatedAt
        }
      }
    `;
    
    const result = await client.graphql({
      query: createMutation,
      variables: {
        input: {
          user_id: userId,
          category: category,
          cost: cost,
          frequency: frequency,
          applicable_calculators: JSON.stringify(applicableCalculators)
        }
      }
    });
    
    // Add to cache after successful creation
    addExpenseToCache(result.data.createExpense);
    
    return result.data.createExpense;
  } catch (error) {
    console.error('Error in createExpense:', error);
    throw error;
  }
}

export async function updateExpense(id, category, cost, frequency, applicableCalculators) {
  try {
    const updateMutation = /* GraphQL */ `
      mutation UpdateExpense($input: UpdateExpenseInput!) {
        updateExpense(input: $input) {
          id
          user_id
          category
          cost
          frequency
          applicable_calculators
          createdAt
          updatedAt
        }
      }
    `;
    
    const result = await client.graphql({
      query: updateMutation,
      variables: {
        input: {
          id: id,
          category: category,
          cost: cost,
          frequency: frequency,
          applicable_calculators: JSON.stringify(applicableCalculators)
        }
      }
    });
    
    // Update in cache after successful update
    updateExpenseInCache(result.data.updateExpense);
    
    return result.data.updateExpense;
  } catch (error) {
    console.error('Error in updateExpense:', error);
    throw error;
  }
}

export async function deleteExpense(id) {
  try {
    const deleteMutation = /* GraphQL */ `
      mutation DeleteExpense($input: DeleteExpenseInput!) {
        deleteExpense(input: $input) {
          id
        }
      }
    `;
    
    const result = await client.graphql({
      query: deleteMutation,
      variables: {
        input: {
          id: id
        }
      }
    });
    
    // Remove from cache after successful deletion
    removeExpenseFromCache(id);
    
    return result.data.deleteExpense;
  } catch (error) {
    console.error('Error in deleteExpense:', error);
    throw error;
  }
}

export async function getExpensesByUserId() {
  try {
    const userId = await getUserId();
    
    const listByUserIdQuery = /* GraphQL */ `
      query ListExpensesByUserId($user_id: String!) {
        listExpenseByUser_id(user_id: $user_id) {
          items {
            id
            user_id
            category
            cost
            frequency
            applicable_calculators
            createdAt
            updatedAt
          }
        }
      }
    `;
    
    const result = await client.graphql({
      query: listByUserIdQuery,
      variables: {
        user_id: userId
      }
    });
    
    return result.data.listExpenseByUser_id.items;
  } catch (error) {
    console.error('Error in getExpensesByUserId:', error);
    throw error;
  }
}



