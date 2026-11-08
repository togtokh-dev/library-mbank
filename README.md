# @togtokh.dev/mbank

M-Bank (**mpay**) payment gateway client for Node.js & TypeScript.

Covers token auth, merchant invoice, deeplink, mpay QR invoice, invoice / QR inquiry, reverse, and user info.

> Base URL defaults to the **pre-production** host `https://preapi.m-bank.mn`.
> Override it with `auth.TOKEN({ host })` or by setting `MBANK.host` for production.

## Install

```bash
npm install @togtokh.dev/mbank
```

## Usage

```ts
import MBANK from "@togtokh.dev/mbank";

// 1) Authenticate — stores the Bearer token on the shared client config.
const auth = await MBANK.auth.TOKEN({
  clientId: process.env.MBANK_CLIENT_ID!,      // HTTP Basic username (OAuth client id)
  clientSecret: process.env.MBANK_CLIENT_SECRET!, // HTTP Basic password (OAuth client secret)
  username: process.env.MBANK_USERNAME!,       // merchant username (body)
  password: process.env.MBANK_PASSWORD!,       // merchant password (body)
  device_id: process.env.MBANK_DEVICE_ID!
  // host: "https://preapi.m-bank.mn"           // optional; override for production
});

if (!auth.success) throw new Error(auth.message);
```

Every method returns `{ success: boolean; message: string; data: any }`.

### Merchant invoice (`m-merchant-invoice-service`)

```ts
// Create invoice
await MBANK.invoice.create({
  remark: "b2c invoice",
  payer_amt: 9999,
  call_back_url: "https://example.com/callback",
  receiver_acc_num: "1105084905",
  receiver_bank_id: "15",
  receiver_acc_name: "Receiver name",
  merchant_invoice_id: "test_01"
});

// Deeplink invoice
await MBANK.invoice.deeplink({
  amount: "435435",
  remark: "Test1",
  call_back_url: "https://example.com/callback",
  merchant_invoice_id: "invoice_deep_link1"
});

// Invoice inquiry (by uuid)
await MBANK.invoice.inquiry("<uuid>");

// User info from mpay
await MBANK.invoice.userinfo("216366", "lunahub");
```

### mpay merchant (`m-retail-app-mpay-service`)

```ts
// Create QR invoice (hasQr defaults to true)
await MBANK.merchant.createInvoice({
  remark: "Invoice05",
  payer_amt: 1800,
  call_back_url: "https://example.com/callback",
  receiver_acc_num: "8011999957",
  merchant_invoice_id: "Invoice67",
  merchant_branch_code: "Branch01",
  merchant_items: [
    { name: "COKE", quantity: 2, unit_price: 800, total_amount: 1600, total_vat: 1, total_city_tax: 8 }
  ]
});

// QR / invoice inquiry (by id)
await MBANK.merchant.inquire("<id>");

// Reverse / cancel (by id)
await MBANK.merchant.reverse("<id>");
```

## Endpoints

| Method | Verb | Path |
| --- | --- | --- |
| `auth.TOKEN` | POST | `/m-retail-third-auth-service/token` |
| `invoice.create` | POST | `/m-merchant-invoice-service/merchant-invoice` |
| `invoice.deeplink` | POST | `/m-merchant-invoice-service/merchant-invoice/deeplink` |
| `invoice.inquiry` | GET | `/m-merchant-invoice-service/merchant-invoice?uuid=` |
| `invoice.userinfo` | GET | `/m-merchant-invoice-service/merchant-invoice/userinfo?user_id=&type=` |
| `merchant.createInvoice` | POST | `/m-retail-app-mpay-service/merchant/createInvoice?hasQr=` |
| `merchant.inquire` | GET | `/m-retail-app-mpay-service/merchant/inquire?id=` |
| `merchant.reverse` | POST | `/m-retail-app-mpay-service/merchant/reverse?id=` |

## License

ISC © TOGTOKH.DEV
