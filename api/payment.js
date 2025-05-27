// api/payment.js - Vercel serverless function for payment processing
import Stripe from 'stripe';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { payment_method_id, amount = 299 } = req.body; // $2.99 in cents
        
        // Initialize Stripe with secret key from environment
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        
        if (!process.env.STRIPE_SECRET_KEY) {
            return res.status(500).json({ error: 'Payment system not configured' });
        }

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            payment_method: payment_method_id,
            confirm: true,
            description: 'LLMs.txt AI Analysis',
            metadata: {
                service: 'llmstxt-ai-analysis',
                version: '1.0'
            }
        });

        if (paymentIntent.status === 'succeeded') {
            res.status(200).json({ 
                success: true, 
                payment_intent_id: paymentIntent.id,
                amount: paymentIntent.amount
            });
        } else {
            res.status(400).json({ 
                success: false, 
                error: 'Payment failed',
                status: paymentIntent.status
            });
        }
        
    } catch (error) {
        console.error('Payment error:', error);
        
        // Handle specific Stripe errors
        if (error.type === 'StripeCardError') {
            res.status(400).json({ 
                success: false,
                error: error.message 
            });
        } else {
            res.status(500).json({ 
                success: false,
                error: 'Payment processing failed' 
            });
        }
    }
} 