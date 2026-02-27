import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { walletAPI } from '../api/services';
import Loading from '../components/Loading';

const PaymentVerify = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('Verifying your payment...');

    useEffect(() => {
        const reference = searchParams.get('reference');

        if (!reference) {
            setStatus('error');
            setMessage('No payment reference found.');
            setTimeout(() => navigate('/dashboard'), 3000);
            return;
        }

        const verify = async () => {
            try {
                const response = await walletAPI.verifyPayment(reference);
                if (response.success) {
                    setStatus('success');
                    setMessage('Payment verified successfully! Your wallet has been credited.');
                } else {
                    setStatus('error');
                    setMessage('Payment verification failed. Please contact support.');
                }
            } catch (err) {
                setStatus('error');
                setMessage(err.response?.data?.message || 'An error occurred during verification.');
            }
            setTimeout(() => navigate('/dashboard'), 3000);
        };

        verify();
    }, [searchParams, navigate]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center -mt-10">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center">
                {status === 'verifying' && (
                    <div className="flex flex-col items-center">
                        <Loading size="lg" />
                        <h2 className="mt-4 text-xl font-bold text-gray-900">Please wait</h2>
                        <p className="mt-2 text-gray-500">{message}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Success!</h2>
                        <p className="mt-2 text-gray-500">{message}</p>
                        <p className="mt-4 text-sm text-gray-400">Redirecting to dashboard...</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-red-600">Verification Failed</h2>
                        <p className="mt-2 text-gray-500">{message}</p>
                        <p className="mt-4 text-sm text-gray-400">Redirecting to dashboard...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentVerify;
