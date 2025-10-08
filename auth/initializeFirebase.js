const admin = require("firebase-admin")
require("dotenv").config();
// const serviceKeys = fs.readFileSync(path.join(__dirname, "../files/misc/firebaseServiceKeys.json"));

const serviceAccount = {
  type: process.env.GOOGLE1_TYPE,
  project_id: process.env.GOOGLE1_PROJECT_ID,
  private_key_id: process.env.GOOGLE1_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE1_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.GOOGLE1_CLIENT_EMAIL,
  client_id: process.env.GOOGLE1_CLIENT_ID,
  auth_uri: process.env.GOOGLE1_AUTH_URI,
  token_uri: process.env.GOOGLE1_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.GOOGLE1_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.GOOGLE1_CLIENT_X509_CERT_URL,
};


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://amni-contractors.firebaseio.com',
    storageBucket: 'amni-contractors.firebaseio.com',
    projectId: "amni-contractors",
})

module.exports = {
    admin
}