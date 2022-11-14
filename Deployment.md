# Deployment

After setting up the development environment as described in the README, complete the following steps to deploy the webapp.

## Deploying backend API

Run the following command at the root directory, which may take some time:

`npx nx build api --prod`

Navigate to `dist/apps/api` and zip all the contents together.

In the Elastic Beanstalk console in AWS create a new environment.

Select Web server environment and fill in the details as you desire

Under Platform, select Node.js with platform branch "Node.js 16 running on 64bit Amazon Linux 2"

Select Upload your code and then Local file.

Choose file and select the zip you created earlier.

Create environment.

After this completes, the health will show as severe.

Go to configuration on the side, select edit in the software section.

Add the appropriate environment properties from the `.env` at the bottom of the page.

Click Apply.

After this completes the health should slowly transition to OK.

Click "Go to environment" on the sidebar. This is the link to your backend API. You will need to change all occurrences in the frontend code to point to this.

## Deploying frontend

Run the following command at the root directory, which may take some time:

`npx nx build --prod`

In the S3 console in AWS create a new bucket.

Fill in as you desire, keeping settings as default.

In your new bucket, select upload.

Click add files and select all files in `dist/apps/tomatoes-app` (NOT the assets folder).

Click add folder, select `dist/apps/tomatoes-app/assets`, click upload.

Click upload, wait and click close when it completes.

In the CloudFront console in AWS create a new distribution.

Under "Origin domain" select your S3 bucket.

Under "Origin access" select "Origin access control settings".

Click "Create control setting", create.

Create distribution.

At the top blue bar, click "Copy policy" and then "Go to S3 bucket permissions"

Under Bucket policy click edit, in the text box right click and select paste. Save changes.

Go back to your CloudFront distribution.

In Behaviours tab, select the default behaviour and click edit.

Under "Cache key and origin requests", under "Cache policy" select "Create policy"

Fill details as you desire.

Under cache key settings, set the Headers to "Include the following headers", add header "Authorization". Create.

Back in the CloudFront tab, click the cache policy refresh icon, then select your new policy. Save changes.

In the Error pages tab, click "Create custom error response".

Under HTTP error code, select "403: Forbidden".

Customize error response: Yes.

Set repose page path to "/index.html"

Change HTTP Response code to 200: OK.

Click "Create custom error response"

Under the General tab, click edit.

Change the default root object to "index.html". Save changes.

Copy your Distribution domain name and navigate to that URL to see your website!

Note: extra steps are required to configure a custom domain with HTTPS. In the meantime, ensure your URL starts with http:// (NOT https://)
