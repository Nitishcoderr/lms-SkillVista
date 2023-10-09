import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import toast from "react-hot-toast"

import axiosInstance from "../../Helpers/axiosInstance"

const initialState = {
  key: "",
  subscription_id: "",
  isPaymentVerified: false,
  allPayments: {},
  finalMonths: {},
  monthlySalesRecord: [],
};


export const getRazorPayId = createAsyncThunk("/razorpay/getId", async () => {
    try {
        const response = await axiosInstance.get("/payments/razorpay-key");
        return response.data;
    } catch(error) {
        toast.error("Failed to load data");
    }
})

export const purchaseCourseBundle = createAsyncThunk(
    "/purchaseCourse",
    async () => {
      try {
        const res = await axiosInstance.post("/payments/subscribe");
        return res.data;
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
    }
  );
  

export const verifyUserPayment = createAsyncThunk(
    "/verifyPayment",
    async (paymentDetail) => {
      try {
        const res = await axiosInstance.post("/payments/verify", {
          razorpay_payment_id: paymentDetail.razorpay_payment_id,
          razorpay_subscription_id: paymentDetail.razorpay_subscription_id,
          razorpay_signature: paymentDetail.razorpay_signature,
        });
        return res?.data;
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
    }
  );
  

  export const getPaymentRecord = createAsyncThunk("/payments/record", async () => {
    try {
        const response = axiosInstance.get("/payments?count=100", );
        toast.promise(response, {
            loading: "Getting the payment records",
            success: (data) => {
                return data?.data?.message
            },
            error: "Failed to get payment records"
        })
        return (await response).data;
    } catch(error) {
        toast.error("Operation failed");
    }
});


export const cancelCourseBundle = createAsyncThunk("/cancelCourse",async () => {
    try {
      const res = axiosInstance.post("/payments/unsubscribe");
      toast.promise(res, {
        loading: "Unsubscribing the bundle...",
        success: "Bundle unsubscibed successfully",
        error: "Failed to unsubscibe the bundle",
      });
      const response = await res;
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

const razorpaySlice = createSlice({
    name: "razorpay",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(getRazorPayId.fulfilled, (state, action) =>{
          console.log('Fulfilled action:', action);
            state.key = action?.payload?.key;
        })
        .addCase(purchaseCourseBundle.fulfilled, (state, action) => {
            state.subscription_id = action?.payload?.subscription_id;
        })
        .addCase(verifyUserPayment.fulfilled, (state, action) => {
            console.log(action);
            toast.success(action?.payload?.message);
            state.isPaymentVerified = action?.payload?.success;
        })
        .addCase(verifyUserPayment.rejected, (state, action) => {
            console.log(action);
            toast.error(action?.payload?.message);
            state.isPaymentVerified = action?.payload?.success;
        })
        .addCase(getPaymentRecord.fulfilled, (state, action) => {
          state.allPayments = action?.payload?.subscriptions;
          state.finalMonths = action?.payload?.finalMonths;
          state.monthlySalesRecord = action?.payload?.monthlySalesRecord;
      })
    }
});

export default razorpaySlice.reducer;