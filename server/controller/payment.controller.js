import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";
import { razorpay } from "../server.js";
import AppError from "../utils/error.util.js";
import crypto from 'crypto'


const getRazorpayApiKey = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            message: 'Razorpay API key',
            key: process.env.RAZORPAY_KEY_ID
        })
    } catch (error) {
        return next(
            new AppError(error.message, 400)
        )
    }
}

 const buySubscription = async (req, res, next) => {
    // Extracting ID from request obj
    const { id } = req.user;
  
    // Finding the user based on the ID
    const user = await User.findById(id);
  
    if (!user) {
      return next(new AppError('Unauthorized, please login'));
    }
  
    // Checking the user role
    if (user.role === 'ADMIN') {
      return next(new AppError('Admin cannot purchase a subscription', 400));
    }
  
    // Creating a subscription using razorpay that we imported from the server
    const subscription = await razorpay.subscriptions.create({
      plan_id: process.env.RAZORPAY_PLAN_ID, // The unique plan ID
      customer_notify: 1, // 1 means razorpay will handle notifying the customer, 0 means we will not notify the customer
      total_count: 12, // 12 means it will charge every month for a 1-year sub.
    });
  
    // Adding the ID and the status to the user account
    user.subscription.id = subscription.id;
    user.subscription.status = subscription.status;
  
    // Saving the user object
    await user.save();
  
    res.status(200).json({
      success: true,
      message: 'subscribed successfully',
      subscription_id: subscription.id,
    });
  };

   const verifySubscription = async (req, res, next) => {
    try {
      const { id } = req.user;
      const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } =
        req.body;
    
      // Finding the user
      const user = await User.findById(id);
  
      if (!user || !user.subscription || !user.subscription.id || !user.subscription.status) {
        return next(new AppError('User subscription not found or invalid', 400));
    }
  
    console.log('User object:', user);
  
    
      // Getting the subscription ID from the user object
      const subscriptionId = user.subscription.id;
  
      const subscriptionStatus = user.subscription?.status;
  
      if (!subscriptionId || !subscriptionStatus) {
          return next(new AppError('User subscription not found or invalid', 400));
      }
    
      // Generating a signature with SHA256 for verification purposes
      // Here the subscriptionId should be the one which we saved in the DB
      // razorpay_payment_id is from the frontend and there should be a '|' character between this and subscriptionId
      // At the end convert it to Hex value
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_SECRET)
        .update(`${razorpay_payment_id}|${subscriptionId}`)
        .digest('hex');
    
      // Check if generated signature and signature received from the frontend is the same or not
      if (generatedSignature !== razorpay_signature) {
        return next(new AppError('Payment not verified, please try again.', 400));
      }
    
      // If they match create payment and store it in the DB
      await Payment.create({
        razorpay_payment_id,
        razorpay_subscription_id,
        razorpay_signature,
      });
    
      // Update the user subscription status to active (This will be created before this)
      user.subscription.status = 'active';
    
      // Save the user in the DB with any changes
      await user.save();
  
      console.log('Updated user object:', user);
    
      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
      });
    } catch (error) {
      return next(new AppError(error.message, 400));
    }
  };
  const cancelSubscription = async (req, res, next) => {
    try {
      const { id } = req.user;
  
      const user = await User.findById(id);
  
      if (!user) {
        return next(new AppError("Unauthorized, please login"));
      }
  
      if (user.role === "ADMIN") {
        return next(new AppError("Admin cannot purchase a subscription", 400));
      }
  
      const subscriptionId = user.subscription.id;
  
      // cancel razorpay subscriptions
      const subscription = await razorpay.subscriptions.cancel(subscriptionId);
  
      user.subscription.status = subscription.status;
  
      await user.save();
      res.status(200).json({
        success: true,
        message: 'Unsubscibed successfully',
      })
    } catch (e) {
      return next(new AppError(e.message, 500));
    }
  };
  
const allPayments = async (req, res, next) => {
    try {
        const { count } = req.query;
        const subscriptions = await razorpay.subscriptions.all({
            count: count || 10,
        });

        res.status(200).json({
            success: true,
            message: 'All payments',
            subscriptions
        })


    } catch (error) {
        return next(
            new AppError(error.message, 400)
        )
    }
}


export {
    getRazorpayApiKey, buySubscription, verifySubscription, cancelSubscription, allPayments
}