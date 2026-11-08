import MBANK from "../src";

// Example usage. Fill in real credentials from your environment — do NOT commit secrets.
const run = async () => {
  // 1) Authenticate — stores the Bearer token on the shared config.
  const auth = await MBANK.auth.TOKEN({
    clientId: process.env.MBANK_CLIENT_ID || "",
    clientSecret: process.env.MBANK_CLIENT_SECRET || "",
    username: process.env.MBANK_USERNAME || "",
    password: process.env.MBANK_PASSWORD || "",
    device_id: process.env.MBANK_DEVICE_ID || ""
    // host: "https://preapi.m-bank.mn" // default; override for production
  });
  console.log("auth:", auth.success, auth.message);
  if (!auth.success) return;

  // 2) Create a merchant invoice.
  const invoice = await MBANK.invoice.create({
    remark: "b2c invoice",
    payer_amt: 9999,
    call_back_url: "https://example.com/callback",
    receiver_acc_num: "1105084905",
    receiver_bank_id: "15",
    receiver_acc_name: "Receiver name",
    merchant_invoice_id: "test_01"
  });
  console.log("invoice:", invoice.success, invoice.data);

  // 3) Deeplink invoice.
  const deeplink = await MBANK.invoice.deeplink({
    amount: "435435",
    remark: "Test1",
    call_back_url: "https://example.com/callback",
    merchant_invoice_id: "invoice_deep_link1"
  });
  console.log("deeplink:", deeplink.success, deeplink.data);

  // 4) mpay QR invoice.
  const qr = await MBANK.merchant.createInvoice({
    remark: "Invoice05",
    payer_amt: 1800,
    call_back_url: "https://example.com/callback",
    receiver_acc_num: "8011999957",
    merchant_invoice_id: "Invoice67",
    merchant_branch_code: "Branch01",
    merchant_items: [
      {
        name: "COKE",
        quantity: 2,
        unit_price: 800,
        total_amount: 1600,
        total_vat: 1,
        total_city_tax: 8
      }
    ]
  });
  console.log("qr:", qr.success, qr.data);

  // 5) Inquiries.
  console.log("invoice inquiry:", (await MBANK.invoice.inquiry("<uuid>")).data);
  console.log("qr inquiry:", (await MBANK.merchant.inquire("<id>")).data);

  // 6) Reverse.
  console.log("reverse:", (await MBANK.merchant.reverse("<id>")).data);

  // 7) User info from mpay.
  console.log("userinfo:", (await MBANK.invoice.userinfo("216366", "lunahub")).data);
};

run();
