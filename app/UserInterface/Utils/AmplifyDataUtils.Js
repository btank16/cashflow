import {generateClient} from 'aws-amplify/data';
import {getUserId} from './UserAttributesCache.Js';

/**
 * @type {import('aws-amplify/data').Client<import('../../../../cashflow-server/amplify/data/resource').Schema>}
 */
const client = generateClient(
    {
        authMode: 'userPool',
    }
);

// Calculation CRUD operations
export const createCalculation = async (calculatorType, inputValues, results) => {
    const userId = await getUserId();
    const date = new Date().toISOString();
    
    try {
        const result = await client.models.Calculation.create({
            user_id: userId,
            date,
            calculator_type: calculatorType,
            input_values: JSON.stringify(inputValues),
            results: JSON.stringify(results)
        });
        return result;
    } catch (error) {
        console.error('Error creating calculation:', error);
        throw error;
    }
};

export const updateCalculation = async (id, calculatorType, inputValues, results) => {
    const userId = await getUserId();
    const date = new Date().toISOString();
    
    try {
        const result = await client.models.Calculation.update({
            id,
            user_id: userId,
            date,
            calculator_type: calculatorType,
            input_values: JSON.stringify(inputValues),
            results: JSON.stringify(results)
        });
        return result;
    } catch (error) {
        console.error('Error updating calculation:', error);
        throw error;
    }
};

export const deleteCalculation = async (id) => {
    try {
        const result = await client.models.Calculation.delete({
            id
        });
        return result;
    } catch (error) {
        console.error('Error deleting calculation:', error);
        throw error;
    }
};

export const getCalculationsByUserId = async () => {
    const userId = await getUserId();
    
    try {
        const result = await client.models.Calculation.listCalculationByUser_id({
            user_id: userId
        });
        return result.data;
    } catch (error) {
        console.error('Error fetching calculations:', error);
        throw error;
    }
};

export const getCalculationsByType = async (calculatorType) => {
    const userId = await getUserId();
    
    try {
        const result = await client.models.Calculation.listCalculationByUser_id({
            user_id: userId
        });
        
        // Filter results by calculator_type
        return result.data.filter(calc => calc.calculator_type === calculatorType);
    } catch (error) {
        console.error('Error fetching calculations by type:', error);
        throw error;
    }
};

// Expense CRUD operations
export const createExpense = async (category, cost, frequency, applicableCalculators) => {
    const userId = await getUserId();
    const date = new Date().toISOString();
    
    try {
        const result = await client.models.Expense.create({
            user_id: userId,
            date,
            category,
            cost,
            frequency,
            applicable_calculators: JSON.stringify(applicableCalculators)
        });
        return result;
    } catch (error) {
        console.error('Error creating expense:', error);
        throw error;
    }
};

export const updateExpense = async (id, category, cost, frequency, applicableCalculators) => {
    const userId = await getUserId();
    const date = new Date().toISOString();
    
    try {
        const result = await client.models.Expense.update({
            id,
            user_id: userId,
            date, 
            category,
            cost,
            frequency,
            applicable_calculators: JSON.stringify(applicableCalculators)
        });
        return result;
    } catch (error) {
        console.error('Error updating expense:', error);
        throw error;
    }
};

export const deleteExpense = async (id) => {
    try {
        const result = await client.models.Expense.delete({
            id
        });
        return result;
    } catch (error) {
        console.error('Error deleting expense:', error);
        throw error;
    }
};

export const getExpensesByUserId = async () => {
    const userId = await getUserId();
    
    try {
        const result = await client.models.Expense.listExpenseByUser_id({
            user_id: userId
        });
        return result.data;
    } catch (error) {
        console.error('Error fetching expenses:', error);
        throw error;
    }
};

export const checkExistingExpense = async (category, cost, frequency) => {
    const userId = await getUserId();
    
    try {
        const result = await client.models.Expense.listExpenseByUser_id({
            user_id: userId
        });
        
        const matchingExpenses = result.data.filter(
            expense => expense.category === category && 
                      expense.cost === cost && 
                      expense.frequency === frequency
        );
        
        if (matchingExpenses.length > 0) {
            return {
                exists: true,
                expenseDetails: matchingExpenses[0],
                calculators: JSON.parse(matchingExpenses[0].applicable_calculators)
            };
        }
        
        return {
            exists: false,
            calculators: []
        };
    } catch (error) {
        console.error('Error checking existing expense:', error);
        return {
            exists: false,
            calculators: []
        };
    }
};


