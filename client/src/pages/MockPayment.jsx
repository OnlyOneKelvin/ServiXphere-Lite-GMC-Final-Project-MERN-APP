import { useState } from 'react';
import { useSearchParams, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MockPayment = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const amount = searchParams.get('amount');
    const reference = searchParams.get('reference');

    const [processing, setProcessing] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState(null);

    if (!amount || !reference) {
        return <Navigate to="/dashboard" />;
    }

    const handlePayment = (method) => {
        setSelectedMethod(method);
        setProcessing(true);

        // Simulate a 2-second payment processing delay
        setTimeout(() => {
            // After simulation, redirect exactly where Paystack would have: to /verify-payment
            navigate(`/verify-payment?reference=${reference}`);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-[#2A2A2A] text-gray-800 font-sans flex flex-col items-center">
            {/* Fake Merchant Header */}
            <div className="w-full max-w-md px-6 py-4 flex items-center gap-3 text-white">
                <button onClick={() => navigate(-1)} className="hover:opacity-75">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <span className="text-sm">Back to merchant site</span>
            </div>

            <div className="w-full max-w-md bg-[#F4F6F8] rounded-t-3xl sm:rounded-3xl mt-2 flex-1 sm:flex-none p-6 shadow-2xl relative overflow-hidden">

                {/* Processing Overlay */}
                {processing && (
                    <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                        <svg className="animate-spin h-10 w-10 text-[#1DA1F2] mb-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="font-semibold text-gray-700">Test Payment Successful!</p>
                        <p className="text-sm text-gray-500 mt-1">Redirecting...</p>
                    </div>
                )}

                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <div className="bg-purple-600 text-white font-black px-2 py-0.5 rounded text-xs select-none">
                            SX
                        </div>
                        <span className="font-bold text-sm text-gray-700">ServiXphere</span>
                    </div>
                    <div className="text-xs text-blue-900 border-b border-blue-900 pb-0.5 font-medium">
                        {user?.email ? `${user.email.substring(0, 3)}***${user.email.substring(user.email.indexOf('@'))}` : 'user@example.com'}
                    </div>
                </div>

                <div className="bg-[#EAF5F5] rounded-xl p-5 mb-8">
                    <p className="text-sm text-[#3E7D7A] font-medium mb-1">Amount to pay</p>
                    <h1 className="text-3xl font-black text-[#0B3D4A] tracking-tight mb-4">
                        ₦{Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </h1>
                    <div className="flex items-center gap-4 text-xs font-semibold text-[#8EB7B5]">
                        <span>Amount ₦{Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        <span className="w-px h-3 bg-[#8EB7B5]"></span>
                        <span>Fee ₦0.00</span>
                    </div>
                </div>

                <h3 className="text-xs font-bold text-[#645A76] tracking-wider mb-4 px-1">SELECT PAYMENT METHOD</h3>

                <div className="space-y-3">
                    <button
                        onClick={() => handlePayment('transfer')}
                        className="w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-[#1DA1F2] hover:shadow transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-[#1DA1F2] flex items-center justify-center">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </div>
                            <span className="font-semibold text-gray-700">Pay with Transfer</span>
                        </div>
                        <svg className="w-5 h-5 text-orange-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    <button
                        onClick={() => handlePayment('card')}
                        className="w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-[#1DA1F2] hover:shadow transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                            <span className="font-semibold text-gray-700">Pay with Card</span>
                        </div>
                        <svg className="w-5 h-5 text-orange-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    <button
                        onClick={() => handlePayment('ussd')}
                        className="w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-[#1DA1F2] hover:shadow transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-yellow-50 text-yellow-500 flex items-center justify-center font-black text-sm">
                                *#
                            </div>
                            <span className="font-semibold text-gray-700">Pay with USSD</span>
                        </div>
                        <svg className="w-5 h-5 text-orange-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    <button
                        onClick={() => handlePayment('phone')}
                        className="w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-[#1DA1F2] hover:shadow transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="font-semibold text-gray-700">Pay with Phone No.</span>
                        </div>
                        <svg className="w-5 h-5 text-orange-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="mt-4 mb-8 flex items-center gap-2 text-white/50 text-xs font-bold tracking-wider">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Secured by <span className="text-white ml-0.5">monnify</span> (Simulated)
            </div>

        </div>
    );
};

export default MockPayment;
