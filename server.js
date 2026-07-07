




CodeAlpha_Simple-E-Commerce-store-main (1).zip
Zip Archive
check this and fix the problem.
where products are not showing and the demo is not works.
after fixing how to change in render and vercel in clear step by step

That warning is normal on Windows. It does not mean the command failed.

git add . worked successfully. Git is only saying it will convert line endings from LF to CRLF for client/package-lock.json when needed.

Now run this next command:

git commit -m "Fix production API connection and CORS"
After that, run:

git push origin main
If the commit command shows “nothing to commit”, send me the full output. If it creates the commit successfully, proceed directly with git push origin main.


PS C:\CodeAlpha-Simple E-Commerce Store> git push origin main
To https://github.com/yashwanthgaddam21/CodeAlpha_Simple-E-Commerce-store.git
 ! [rejected]        main -> main (fetch first)
error: failed to push some refs to 'https://github.com/yashwanthgaddam21/CodeAlpha_Simple-E-Commerce-store.git'
hint: Updates were rejected because the remote contains work that you do not
hint: have locally. This is usually caused by another repository pushing to
hint: the same ref. If you want to integrate the remote changes, use
hint: 'git pull' before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
PS C:\CodeAlpha-Simple E-Commerce Store> 

This happens because you edited something directly on GitHub earlier, so GitHub has commits that are not yet in your local project. First pull those changes, then push yours.

Run these commands one at a time:

git pull origin main --rebase
If it finishes with something like Successfully rebased and updated refs/heads/main, run:

git push origin main
If Git opens a screen asking for a commit message, do not change anything. Press:

Esc
Then type:

:wq
Then press Enter.

If you see a conflict message such as CONFLICT (content), do not run more commands yet. Copy the complete terminal output here, and I’ll tell you exactly which file and lines to fix.


Successfully rebased and updated refs/heads/main.
PS C:\CodeAlpha-Simple E-Commerce Store> git push origin main
Enumerating objects: 6, done.
Counting objects: 100% (6/6), done.
Delta compression using up to 16 threads
Compressing objects: 100% (3/3), done.
Writing objects: 100% (4/4), 412 bytes | 412.00 KiB/s, done.
Total 4 (delta 2), reused 0 (delta 0), pack-reused 0 (from 0)
remote: Resolving deltas: 100% (2/2), completed with 2 local objects.
To https://github.com/yashwanthgaddam21/CodeAlpha_Simple-E-Commerce-store.git
   e31a2a6..ec3f69d  main -> main
PS C:\CodeAlpha-Simple E-Commerce Store> 

8cae8e75-082c-479e-aa82-3f3a8dd723ef.png
10f23465-ec61-4fd4-8f9d-6df3f4b7b280.png

Your Render deployment is Live, so the backend started correctly.

The error in the browser is only because you opened the base URL:

https://shopnest-api-5cnt.onrender.com/

Your currently deployed backend does not have a / route. That is not the product problem. Test the correct API URL instead:

Open ShopNest health check

Copy this into the browser address bar:

https://shopnest-api-5cnt.onrender.com/api/health
If it shows:

{
  "success": true,
  "message": "ShopNest API is healthy"
}
then test products:

https://shopnest-api-5cnt.onrender.com/api/products
If /api/health also shows Not Found, it means the server.js file we changed is not the file Render is actually running. Your screenshot’s error path says Render is running from:

/opt/render/project/src/
and the stack mentions src/middleware/errorMiddleware.js. So your real backend entry file is likely inside a src folder, not the root server.js.

In Render, click Settings and check Root Directory. Send me a screenshot of the Settings section that shows Root Directory, Build Command, and Start Command. Also open your GitHub repository and send a screenshot showing the top-level folders/files, especially whether you have a src folder and where server.js is located.

Do not seed products or update Vercel yet—we need to confirm the exact backend entry file first.


api health and product health works perfectly

Great — that confirms your Render backend is working and MongoDB is returning products.

Now only the Vercel frontend needs to be connected to it.

Go to your project in Vercel Dashboard and follow these exact steps:

Click Settings → Environment Variables.

Click Add New and enter:

Key: VITE_API_URL
Value: https://shopnest-api-5cnt.onrender.com/api
Select all three environments:

Production
Preview
Development
Then click Save.

Go to Settings → General and confirm these values:

Framework Preset: Vite
Root Directory: client
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Go to Deployments. Open the latest deployment, click the three dots (...) and choose Redeploy.

If you see Use existing Build Cache, turn it off / choose Redeploy without cache.

Wait until deployment status becomes Ready. Then open your live site:

ShopNest live demo

Open the Products page and refresh once. On the first visit, Render may take up to about a minute to wake up; after that, products should appear.

If products still do not show, open browser developer tools with F12 → Console, refresh the Products page, and send a screenshot showing the red error messages.


446ee003-54dc-44a3-b0d1-d610079274f2.png
1d36f07f-d15e-42a7-b57f-6499a60ddca2.png
45892a84-e3e5-4ed4-9500-d9e8f6ddb9e2.png

Your Render setup is correct:

Root Directory: empty — correct, because server.js and package.json are in the repository root.

Build Command: npm install — correct.

Start Command: npm start — correct.

The health and products endpoints work — backend and database are working.

So do not change anything more in Render.

Now fix only Vercel.

Open your Vercel project and go to Settings → Environment Variables. Add this exact variable:

Name: VITE_API_URL
Value: https://shopnest-api-5cnt.onrender.com/api
For environments, tick all three:

Production
Preview
Development
Click Save.

Then go to Settings → General and make sure these values are set:

Root Directory: client
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
After saving, go to Deployments → click the latest deployment → click the three dots → Redeploy. If it asks about cache, choose Redeploy without cache.

When it becomes Ready, open your live website and press Ctrl + Shift + R once. The products should then load because the frontend will call:

https://shopnest-api-5cnt.onrender.com/api/products
One small correction: the base Render URL showing “Not Found /” is normal for the code currently deployed, because its / route was not updated in the running commit. It does not affect the website because your frontend uses /api/products, which you already confirmed works.


vercel process step by step

Follow these Vercel steps exactly. Keep the Render tab open, but you do not need to change anything there.

1. Open your Vercel project
Open Vercel Dashboard and sign in.

Click the project that is connected to your GitHub repository: CodeAlpha_Simple-E-Commerce-store / your ShopNest frontend project.

2. Add the API URL environment variable
At the top of the project page, click:

Settings
In the left sidebar, click:

Environment Variables
Click:

Add New
Fill the fields exactly like this:

Key:
VITE_API_URL

Value:
https://shopnest-api-5cnt.onrender.com/api
Below the value, select these environments:

✓ Production
✓ Preview
✓ Development
Click:

Save
After saving, you should see one row like this:

VITE_API_URL     Production, Preview, Development
3. Check Vercel build settings
Still inside Settings, click:

General
Scroll until you find Build and Deployment Settings.

Click Edit if needed and set:

Framework Preset: Vite
Root Directory: client
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Click Save.

Important: if Vercel shows the Root Directory as ./ or blank, change it to:

client
This is necessary because your React/Vite frontend is inside the client folder.

4. Redeploy the frontend
Click:

Deployments
Open the latest deployment—the top one.

Click the three dots (...) near the deployment.

Click:

Redeploy
A confirmation popup opens. If you see an option like:

Use existing Build Cache
turn it off.

Then click:

Redeploy
Wait until the status changes to:

Ready
5. Test the website
Click the deployment URL, or open:

ShopNest live demo

Press:

Ctrl + Shift + R
Then go to the Products page.

The first request can take 30–60 seconds because the Render free backend wakes up after inactivity. Wait for one minute, then refresh the Products page once.

6. If products still do not show
Press:

F12
Click the Console tab.

Refresh the Products page with:

Ctrl + R
Send a screenshot that shows any red error messages in the Console.


4ddc6bb4-aeea-48ad-b791-4c8acabbb57d.png

You opened Create Pre-production Environment by mistake. You do not need this page.

Click Cancel at the bottom-left.

Then follow this exact path:

Go back to your Vercel project page.

Click Settings at the top.

In the left sidebar, click Environment Variables.

On that page, look for a button named Add New or Create New near the top-right. Do not click “Create Pre-production Environment.”

Add this variable:

Key: VITE_API_URL
Value: https://shopnest-api-5cnt.onrender.com/api
For the environment selection, choose Production. If you can also select Preview and Development, select them too, but Production is the important one.

Click Save.

After that, go to Deployments → latest deployment → ... → Redeploy → choose Redeploy without cache if shown.


it says already exists

That is good — it means VITE_API_URL has already been added.

Do not create it again. Click Cancel on the popup.

Now check the existing variable:

Go to Settings → Environment Variables.

Find the row named:

VITE_API_URL
Click the three dots or Edit beside it.

Confirm its value is exactly:

https://shopnest-api-5cnt.onrender.com/api
Confirm Production is selected. If available, also enable Preview and Development.

Click Save.

Then redeploy so Vercel uses that variable:

Click Deployments.

Click the top/latest deployment.

Click the ... menu.

Click Redeploy.

If it shows Use existing Build Cache, switch it off.

Click Redeploy and wait until it says Ready.

Then open your demo and press Ctrl + Shift + R:

ShopNest live demo

If the Products page still shows nothing after waiting one minute and refreshing, send a screenshot of the existing VITE_API_URL row in Vercel’s Environment Variables page.


2f63d0d0-4bf5-4b5b-aee3-dd20e33f67ca.png

This is the correct screen.

Keep Production selected. The checkbox Use existing Build Cache is already unchecked, which is what we want.

Now click the white Redeploy button at the bottom-right.

After clicking it:

Wait until the deployment status changes to Ready.

Open the assigned domain shown there: ShopNest live demo

Press Ctrl + Shift + R.

Wait up to one minute for Render to wake up, then refresh the page once.

Open the Products page.

If products still do not appear, press F12, open Console, refresh the Products page, and send a screenshot of the red error message.


4f53eac9-1265-4557-8c5d-2dc34bae6021.png

The console shows the exact issue: CORS is blocking the current Vercel deployment URL.

Your frontend is currently running from:

https://code-alpha-simple-e-commerce-store-r5pi3c344.vercel.app
But Render only allows the older URL:

https://code-alpha-simple-e-commerce-store-gilt.vercel.app
Fix it in Render now.

1. Open Render Environment
Open your shopnest-api service in Render Dashboard.

Click Environment in the left menu.

Find:

CLIENT_URL
Click Edit.

2. Replace the value with this exact URL
Copy-paste this:

https://code-alpha-simple-e-commerce-store-r5pi3c344.vercel.app
Click Save Changes.

Do not add / at the end.

3. Wait for Render to redeploy
Render should automatically deploy after you save the environment variable. Wait until it says Live.

Then open the current Vercel URL again and press:

Ctrl + Shift + R
Products should appear.

Important: make both Vercel URLs work
Because you have two Vercel URLs, it is better to update server.js once so both are allowed permanently.

Open server.js in GitHub, find this line:

process.env.CLIENT_URL,
Replace that single line with:

process.env.CLIENT_URL,
'https://code-alpha-simple-e-commerce-store-gilt.vercel.app',
'https://code-alpha-simple-e-commerce-store-r5pi3c344.vercel.app',
Then scroll down and click Commit changes. Render will deploy automatically because Auto-Deploy is enabled.

After it is Live, test both URLs.


git hub is not updated with the latest code in vs

That explains why the CORS update is not reaching Render. Your local VS Code code may have changes that are not committed or pushed yet.

In the VS Code terminal, inside:

C:\CodeAlpha-Simple E-Commerce Store
run these commands one by one:

git status
This will show which files are changed.

Then run:

git add .
Then create a new commit:

git commit -m "Allow Vercel deployment URLs in CORS"
Then push it:

git push origin main
After the push, refresh your GitHub repository page. You should see the latest commit at the top.

Then Render will automatically redeploy because your service has Auto-Deploy: On Commit.

For the CORS fix, first make sure your local server.js contains this exact section before committing:

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
  'https://code-alpha-simple-e-commerce-store-gilt.vercel.app',
  'https://code-alpha-simple-e-commerce-store-r5pi3c344.vercel.app',
].filter(Boolean);
Save server.js with Ctrl + S, then run the Git commands above.

After Render becomes Live, open your Vercel site and press Ctrl + Shift + R.


require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const { getAdminStats } = require('./controllers/orderController');
const { protect } = require('./middleware/authMiddleware');
const { adminOnly } = require('./middleware/adminMiddleware');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

connectDB();

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin',
    },
  })
);

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(CORS blocked this origin: ${origin}));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'ShopNest API is running',
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ShopNest API is healthy',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/api/admin/stats', protect, adminOnly, getAdminStats);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(Server running on port ${PORT});
});

Replace your entire server.js file with this version. It allows localhost plus both Vercel URLs, including future Vercel preview deployments ending in .vercel.app.

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const { getAdminStats } = require('./controllers/orderController');
const { protect } = require('./middleware/authMiddleware');
const { adminOnly } = require('./middleware/adminMiddleware');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

connectDB();

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin',
    },
  })
);

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
  'https://code-alpha-simple-e-commerce-store-gilt.vercel.app',
  'https://code-alpha-simple-e-commerce-store-r5pi3c344.vercel.app',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allows direct browser requests, Render health checks, and Postman.
      if (!origin) {
        return callback(null, true);
      }

      const isAllowedOrigin =
        allowedOrigins.includes(origin) ||
        /^https:\/\/code-alpha-simple-e-commerce-store-[a-z0-9-]+\.vercel\.app$/.test(
          origin
        );

      if (isAllowedOrigin) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked this origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'ShopNest API is running',
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ShopNest API is healthy',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/api/admin/stats', protect, adminOnly, getAdminStats);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


