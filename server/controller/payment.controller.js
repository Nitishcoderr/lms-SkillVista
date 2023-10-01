
const getRazorpayApiKey = async(req,res,next)=>{
    res.status(200).json({
        success:true,
        message:'Razorpay API key',
        key:process.env.RAZORPAY_KEY_ID
    })
}
const buySubscription = async(req,res,next)=>{
    
}
const verifySubscription = async(req,res,next)=>{

}
const cancelSubscription = async(req,res,next)=>{

}
const allPayments = async(req,res,next)=>{

}


export {
    getRazorpayApiKey,buySubscription,verifySubscription,cancelSubscription,allPayments
}