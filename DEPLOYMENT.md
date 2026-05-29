# Deployment Guide

This guide walks you through getting the Astro project from a folder on your computer to a live site on the internet.

You do not need to install Node.js, run any commands, or know anything technical. Netlify handles all of that automatically.

---

## Part 1 — Get the code onto GitHub

GitHub stores your site's source code. Netlify reads from GitHub to build and deploy the site.

### Option A — Using GitHub's web interface (simplest, no software to install)

1. Go to [github.com](https://github.com) and log in.
2. Click the **+** icon in the top right, then **"New repository"**.
3. Repository name: `eliyannah-direct-site`
4. Description: "The personal site of Eliyannah Amirah Yisrael."
5. Set visibility to **Public**.
6. Leave the "Initialize this repository" options **unchecked** (don't add a README, .gitignore, or license — we already have those).
7. Click **"Create repository"**.

You'll see a page that says "Quick setup." Ignore the command-line options. Look for the link that says **"uploading an existing file"** (it's in a sentence near the top of the page).

8. Click "uploading an existing file."
9. Drag the entire contents of the `eliyannah-direct-site` folder into the browser. Make sure you're uploading the *contents* of the folder, not the folder itself.
10. Scroll to the bottom and click **"Commit changes"**.

Done. Your code is on GitHub.

### Option B — Using GitHub Desktop (recommended if you'll be making frequent updates)

1. Download [GitHub Desktop](https://desktop.github.com) — free.
2. Sign in with your GitHub account.
3. Choose **File → New repository** (or Add Existing Repository if you've already created one).
4. Set the local path to wherever you put the `eliyannah-direct-site` folder.
5. Click **Publish repository** in the top toolbar.
6. Set name, description, and uncheck "Keep this code private."
7. Click **Publish**.

Done.

---

## Part 2 — Connect Netlify to the GitHub repo

1. Go to [app.netlify.com](https://app.netlify.com) and log in with the account you already use for The Forest of God's Answers.
2. Click **"Add new site"** (top right) → **"Import an existing project"**.
3. Choose **"Deploy with GitHub"**.
4. If prompted, authorize Netlify to access your GitHub repositories.
5. Find and select `eliyannah-direct-site` from the list.
6. On the deploy settings page, you should see:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

   These should already be filled in correctly (they come from the `netlify.toml` file in the project). If they're not, type them in.

7. Click **"Deploy"** (or **"Deploy site"**).

Netlify will take 1-3 minutes to build the site. You'll see a log of what it's doing. When it finishes, you'll get a URL like `random-name-12345.netlify.app` — that's your live site.

---

## Part 3 — Verify the site works

1. Click the URL Netlify gave you.
2. The site should look identical to the v2 preview, but now it's live on the internet.
3. Click through the nav. All 8 pages should load.
4. Check on your phone. The mobile nav should work.

If anything is broken, take a screenshot and let me know. Most likely cause of breakage at this stage: a typo in one of the page files. Easy to fix.

---

## Part 4 — Rename the Netlify site (optional but recommended)

1. On Netlify, go to **Site configuration → General → Site details**.
2. Click **"Change site name"**.
3. Change it to `eliyannah-direct` or `sunshinemoxie` or whatever you want.
4. The URL becomes `your-name.netlify.app` — easier to share temporarily before we point the real domain.

---

## Part 5 — Point sunshinemoxie.co at the site

**Do not do this step yet.** We'll do it together once everything looks right at the Netlify URL.

When ready:

1. In Netlify, go to **Domain management**.
2. Click **"Add custom domain"** → type `sunshinemoxie.co`.
3. Netlify will give you DNS records to set in your domain registrar (where you bought sunshinemoxie.co).
4. Add those records in your registrar's DNS settings.
5. DNS propagation takes 5 minutes to 24 hours. The site will gradually become available at sunshinemoxie.co.

---

## What's next after this deployment

Once the site is live at the Netlify URL and verified working, we move to **Session 2: adding Keystatic CMS**. That session adds the `/keystatic` admin route so you can update content from any browser without coming back to me.

---

## If something goes wrong

The most common issue is a Netlify build failure. If you see a red "Build failed" message:

1. Click into the failed build.
2. Read the log — usually the last 10-20 lines tell you what failed.
3. Copy the error and send it to me in a new chat. I can usually fix it in one message.

Other than build failures, almost everything else can be fixed by re-uploading files to GitHub. The site will redeploy automatically.
