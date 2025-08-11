import { Payment } from '../types/Payment';

// Mock Paystack service for development
export const processPayment = async (paymentData: Payment): Promise<{ status: string }> => {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock successful payment (90% success rate)
    const success = Math.random() > 0.1;
    
    return {
        status: success ? 'success' : 'failed'
    };
};

export const initializePayment = async (amount: number, email: string): Promise<{ authorization_url: string; reference: string }> => {
    // Mock payment initialization
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
        authorization_url: `https://checkout.paystack.com/mock-${Date.now()}`,
        reference: `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
};

export const verifyPayment = async (reference: string): Promise<{ status: string; data: any }> => {
    // Mock payment verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const success = Math.random() > 0.1;
    
    return {
        status: success ? 'success' : 'failed',
        data: {
            reference,
            amount: 10000, // Mock amount in kobo
            status: success ? 'success' : 'failed'
        }
    };
};