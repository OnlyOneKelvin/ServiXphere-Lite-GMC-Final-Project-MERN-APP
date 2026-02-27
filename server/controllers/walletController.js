const User = require('../models/User');
const Transaction = require('../models/Transaction');
const crypto = require('crypto');

// @desc    Initialize wallet top-up payment (MOCK/SIMULATED)
// @route   POST /api/wallet/initialize
// @access  Private
exports.initializePayment = async (req, res) => {
    try {
        const amount = Number(req.body.amount); // Amount in NGN

        if (!amount || amount <= 0 || isNaN(amount)) {
            return res.status(400).json({ success: false, message: 'Please provide a valid amount' });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Mock reference
        const reference = 'mock_' + crypto.randomBytes(8).toString('hex');

        // Let's assume frontend runs on 5173 or the same domain
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

        // Create pending transaction in DB
        await Transaction.create({
            user: user._id,
            amount: amount,
            type: 'top_up',
            status: 'pending',
            reference: reference,
        });

        // Simulate returning a payment gateway URL (which is our own mock page)
        return res.status(200).json({
            success: true,
            data: {
                // Return our simulated mock payment page
                authorization_url: `${frontendUrl}/mock-payment?reference=${reference}&amount=${amount}`,
                reference: reference,
            },
        });
    } catch (error) {
        console.error('Payment initialization error:', error.message);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Verify payment and update wallet (MOCK/SIMULATED)
// @route   GET /api/wallet/verify/:reference
// @access  Private
exports.verifyPayment = async (req, res) => {
    try {
        const { reference } = req.params;

        if (!reference) {
            return res.status(400).json({ success: false, message: 'Payment reference is required' });
        }

        const transaction = await Transaction.findOne({ reference });

        if (!transaction) {
            return res.status(404).json({ success: false, message: 'Transaction not found' });
        }

        if (transaction.status === 'success') {
            // Already processed — return success so the UI shows the green checkmark
            const user = await User.findById(transaction.user);
            return res.status(200).json({
                success: true,
                message: 'Payment already verified. Wallet was credited.',
                data: {
                    walletBalance: user.walletBalance || 0,
                    amountAdded: transaction.amount
                }
            });
        }

        // --- SIMULATED VERIFICATION (ALWAYS APPROVES) ---
        // Instead of calling Paystack, we just mark it success locally.
        transaction.status = 'success';
        await transaction.save();

        // Update user wallet balance
        const user = await User.findById(transaction.user);
        user.walletBalance = (user.walletBalance || 0) + transaction.amount;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Mock Payment successful, wallet updated',
            data: {
                walletBalance: user.walletBalance,
                amountAdded: transaction.amount
            }
        });

    } catch (error) {
        console.error('Payment verification error:', error.message);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get user's wallet balance and transaction history
// @route   GET /api/wallet/balance
// @access  Private
exports.getWalletDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('walletBalance');
        const transactions = await Transaction.find({ user: req.user.id }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: {
                balance: user.walletBalance || 0,
                transactions
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};
