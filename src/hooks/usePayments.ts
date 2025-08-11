import { useState } from 'react';
import { processPayment } from '../services/paystack';
import { Payment } from '../types/Payment';

const usePayments = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const makePayment = async (paymentData: Payment) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await processPayment(paymentData);
            if (response.status === 'success') {
                setSuccess(true);
            } else {
                setError('Payment failed. Please try again.');
            }
        } catch (err) {
            setError('An error occurred while processing the payment.');
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        success,
        makePayment,
    };
};

export default usePayments;