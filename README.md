<div align="center">
  <img src="https://lh3.googleusercontent.com/aida/AP1WRLu0i4xhsSqrSBRtk7Qr4tpqJzbwDf3SyDqsOJnEvwhbn0pphdgqisTuVRmkdGjfOFhHASwBerCDL24s1YRfBHNHk_jNGBZc2IjiS6L3LB4UPsO0sXjy9lWPclQTxmEwfGvAChZFzs5mDO7sHWfhDE0U7QnlHKKHd8D6njxpCW6cc0kY3rgrNfUdqwbGPfEafpBSa9h0cGsGqGLTWhgFrDDvSUhGzTAcnpW80jNT3Uktjsm275dsizmcdg" alt="ScholarPay Logo" width="120" />
  <h1>ScholarPay</h1>
  <h3><em>✨ Smart Budgets, Smart Travel ✨</em></h3>
</div>

<p align="center">
  The ultimate financial companion for international students. Track your scholarship funds, manage expenses by category, and stay on budget — all in your preferred currency.
</p>

---

## 🌍 About This Repository

This repository contains the source code for the **ScholarPay Landing Page** and the **Download Analytics Tracker**. It provides a sleek, modern interface for distributing the ScholarPay Android APK outside of the Google Play Store, while seamlessly tracking download statistics via Cloudflare Workers and KV.

## ✨ Features of ScholarPay

- **💱 Multi-Currency Support:** View balances in 170+ currencies with live exchange rates.
- **🎓 Scholarship Tracking:** Log your disbursements and watch balances update as you spend.
- **📊 Budget Categories:** Organize spending into custom categories like Rent or Groceries.
- **🔔 Smart Budget Alerts:** Get notified when you're nearing or exceeding limits.
- **🧳 Packing Checklist:** Built-in travel essentials list with a departure countdown.
- **📄 PDF Export:** Export a full PDF report of your transaction history to share or save.

## 📂 Repository Structure

- `page/`: The static landing page (built with HTML, Tailwind CSS) deployed via Cloudflare Pages.
- `worker/`: The Cloudflare Worker script that acts as a secure download tracker, logging metrics into Cloudflare KV before redirecting users to the APK download.

## 🚀 Deployment Instructions

### Prerequisites
- A free [Cloudflare account](https://dash.cloudflare.com/sign-up)
- [Node.js](https://nodejs.org/) installed (for the Wrangler CLI)

### 1. Deploy the Download Page (Cloudflare Pages)
1. Go to **Cloudflare Dashboard** → **Workers & Pages** → **Pages** → **Create a Pages project**
2. Choose **Direct Upload** (or connect this git repository).
3. Upload the contents of the `page/` folder.
4. Note your deployed URL (e.g., `https://scholarpay-download.pages.dev`).

### 2. Configure Analytics (Cloudflare KV)
1. Navigate to **Workers & Pages** → **KV** → **Create namespace**.
2. Name the namespace: `APP_DOWNLOADS`.
3. Copy the generated **Namespace ID**.

### 3. Deploy the Worker (Download Tracker)
1. Update `worker/wrangler.toml` and replace the placeholder KV namespace ID with your new **Namespace ID**.
2. In `worker/index.js`, ensure the `APK_URL` points to your hosted APK file (e.g., a GitHub Release URL).
3. Deploy the worker using Wrangler:
   ```bash
   cd worker/
   npm install -g wrangler
   wrangler login
   wrangler deploy
   ```
4. Copy the resulting Worker URL (e.g., `https://scholarpay-download-tracker.your-subdomain.workers.dev`).

### 4. Link the Page to the Worker
1. Open `page/index.html`.
2. Locate the download tracker script at the bottom of the file and update the `WORKER_URL` variable to point to your new Worker URL.
3. Re-deploy the `page/` folder to Cloudflare Pages.

## 📈 Viewing Download Stats

### Quick Total Count
You can programmatically query the total downloads using Cloudflare's API:
```bash
curl https://api.cloudflare.com/client/v4/accounts/{account_id}/storage/kv/namespaces/{namespace_id}/values/counter:total
```

### Dashboard View
Navigate to **Cloudflare Dashboard → Workers & Pages → KV → `APP_DOWNLOADS` → View keys** to see granular, day-by-day download metrics.

## 📄 License

This project is open-source and available under the MIT License.
