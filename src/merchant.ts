import axios from "axios";
import MBANK from "./";

export interface MerchantItem {
  name: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  total_vat?: number;
  total_city_tax?: number;
}

export interface CreateInvoiceParams {
  remark: string;
  payer_amt: number;
  call_back_url: string;
  merchant_items: MerchantItem[];
  receiver_acc_num: string;
  merchant_invoice_id: string;
  merchant_branch_code?: string;
}

type Result = Promise<{ success: boolean; message: string; data: any }>;

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
 * Create an mpay merchant invoice (optionally with a QR).
 * POST {host}/m-retail-app-mpay-service/merchant/createInvoice?hasQr={hasQr}
 */
const createInvoice = (params: CreateInvoiceParams, hasQr = true): Result =>
  wrap(() =>
    axios.post(
      `${MBANK.host}/m-retail-app-mpay-service/merchant/createInvoice`,
      params,
      {
        params: { hasQr },
        headers: {
          Authorization: `Bearer ${MBANK.token}`,
          "Content-Type": "application/json"
        }
      }
    )
  );

/**
 * QR / invoice inquiry by id.
 * GET {host}/m-retail-app-mpay-service/merchant/inquire?id={id}
 */
const inquire = (id: string): Result =>
  wrap(() =>
    axios.get(`${MBANK.host}/m-retail-app-mpay-service/merchant/inquire`, {
      params: { id },
      headers: { Authorization: `Bearer ${MBANK.token}` }
    })
  );

/**
 * Reverse (cancel) an invoice by id.
 * POST {host}/m-retail-app-mpay-service/merchant/reverse?id={id}
 */
const reverse = (id: string): Result =>
  wrap(() =>
    axios.post(
      `${MBANK.host}/m-retail-app-mpay-service/merchant/reverse`,
      null,
      {
        params: { id },
        headers: { Authorization: `Bearer ${MBANK.token}` }
      }
    )
  );

export default { createInvoice, inquire, reverse };
