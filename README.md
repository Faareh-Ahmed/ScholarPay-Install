# ScholarPay Share

Download landing page + download tracker for distributing ScholarPay APK outside the Play Store.

## Folder Structure

```
ScholarPayShare/
├── page/                     # Cloudflare Pages site (static)
│   └── index.html            # Download landing page
├── worker/                   # Cloudflare Worker (download tracker)
│   ├── index.js              # Logs downloads to KV, redirects to APK
│   └── wrangler.toml         # Worker configuration
├── APK_INSTRUCTIONS.txt      # How to update the APK for new releases
└── README.md                 # This file
```

## Deployment Instructions

### Prerequisites

- A free [Cloudflare account](https://dash.cloudflare.com/sign-up)
- [Node.js](https://nodejs.org/) installed (for wrangler CLI)
- Your APK file ready

---

### 1. Deploy the Download Page (Cloudflare Pages)

1. Go to **Cloudflare Dashboard** → **Workers & Pages** → **Pages** → **Create a Pages project**
2. Choose **Direct Upload** (or connect a git repo)
3. Upload the contents of the `page/` folder (just `index.html`)
4. Set the project name to `scholarpay-download`
5. After deployment, note your URL: `https://scholarpay-download.pages.dev`

---

### 2. Upload the APK

Upload your APK file alongside the Pages site:

1. Go to your Pages project → **Deployments** → **Upload new assets**
2. Upload `scholarpay-v1.apk` (or rename to `scholarpay.apk`)
3. The APK will be available at: `https://scholarpay-download.pages.dev/scholarpay.apk`

---

### 3. Create the KV Namespace

1. Go to **Workers & Pages** → **KV** → **Create namespace**
2. Name it: `APP_DOWNLOADS`
3. Copy the **Namespace ID**

---

### 4. Update Worker Configuration

1. Open `worker/wrangler.toml`
2. Replace `REPLACE_WITH_YOUR_KV_NAMESPACE_ID` with the ID you copied
3. Open `worker/index.js` and update the `APK_URL` to your actual file URL:
   ```js
   APK_URL: 'https://scholarpay-download.pages.dev/scholarpay.apk',
   ```

---

### 5. Deploy the Worker

```bash
cd worker/

# Install wrangler (if not already installed)
npm install -g wrangler

# Log in to Cloudflare
wrangler login

# Deploy the worker
wrangler deploy
```

After deployment, you'll get a URL like:
`https://scholarpay-download-tracker.your-subdomain.workers.dev`

---

### 6. Link the Page to the Worker

1. Open `page/index.html`
2. Update the `WORKER_URL` at the bottom of the file:
   ```js
   const WORKER_URL = 'https://scholarpay-download-tracker.your-subdomain.workers.dev'
   ```
3. Re-deploy the Pages site (upload updated `index.html`)

---

### 7. Share the Link

Your download page is live at:
```
https://scholarpay-download.pages.dev
```

Share this link with your users. They can also generate a QR code from it for easy mobile access.

---

## How to View Download Stats

### Total count (quick)
```bash
curl https://api.cloudflare.com/client/v4/accounts/{account_id}/storage/kv/namespaces/{namespace_id}/values/counter:total
```

### All logs
- Dashboard → Workers & Pages → KV → `APP_DOWNLOADS` → **View keys**

### View downloads for a specific day
```
KV key: counter:2025-06-25
```

---

## Updating for a New App Version

1. Build the new APK from the main project
2. Overwrite `page/scholarpay.apk` with the new APK
3. Update `APP_VERSION` in `worker/index.js`
4. Update the version number in `page/index.html`
5. Re-deploy both Pages and Worker

## Cost

| Service | Cost | Limits |
|---------|------|--------|
| Cloudflare Pages | Free | Unlimited bandwidth |
| Cloudflare Workers | Free | 100,000 requests/day |
| Cloudflare KV | Free | 1 GB storage, 1000 writes/day |
| **Total** | **$0** | — |
