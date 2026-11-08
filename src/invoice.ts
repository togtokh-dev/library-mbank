import axios from "axios";
import MBANK from "./";

export interface MerchantInvoiceParams {
  type?: string;
  remark: string;
  payer_amt: number;
  redirect_url?: string;
  call_back_url: string;
  receiver_acc_num: string;
  receiver_bank_id?: string;
  receiver_acc_name?: string;
  merchant_invoice_id: string;
}

export interface DeeplinkParams {
  amount: string | number;
  remark: string;
  redirect_url?: string;
  call_back_url: string;
  merchant_invoice_id: string;
}

type Result = Promise<{ success: boolean; message: string; data: any }>;

const authHeaders = () => ({
  Authorization: `Bearer ${MBANK.token}`,
  "Content-Type": "application/json"
});

const wrap = async (fn: () => Promise<any>): Result => {
  try {
    const { data } = await fn();
    return { success: true, message: "success", data };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || error?.message || "error",
      data: error?.response?.data || null
    };
  }
};

/**
 * Create a merchant invoice (b2c).
 * POST {host}/m-merchant-invoice-service/merchant-invoice
 */
const create = (params: MerchantInvoiceParams): Result =>
  wrap(() =>
    axios.post(`${MBANK.host}/m-merchant-invoice-service/merchant-invoice`, params, {
      headers: authHeaders()
    })
  );

/**
 * Create a deeplink invoice.
 * POST {host}/m-merchant-invoice-service/merchant-invoice/deeplink
 */
const deeplink = (params: DeeplinkParams): Result =>
  wrap(() =>
    axios.post(
      `${MBANK.host}/m-merchant-invoice-service/merchant-invoice/deeplink`,
      params,
      { headers: authHeaders() }
    )
  );

/**
 * Invoice inquiry by uuid.
 * GET {host}/m-merchant-invoice-service/merchant-invoice?uuid={uuid}
 */
const inquiry = (uuid: string): Result =>
  wrap(() =>
    axios.get(`${MBANK.host}/m-merchant-invoice-service/merchant-invoice`, {
      params: { uuid },
      headers: { Authorization: `Bearer ${MBANK.token}` }
    })
  );

/**
 * Get user info from mpay.
 * GET {host}/m-merchant-invoice-service/merchant-invoice/userinfo?user_id={user_id}&type={type}
 */
const userinfo = (user_id: string | number, type = "lunahub"): Result =>
  wrap(() =>
    axios.get(
      `${MBANK.host}/m-merchant-invoice-service/merchant-invoice/userinfo`,
      {
        params: { user_id, type },
        headers: { Authorization: `Bearer ${MBANK.token}` }
      }
    )
  );

export default { create, deeplink, inquiry, userinfo };
