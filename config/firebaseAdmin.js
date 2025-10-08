const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");
require("dotenv").config();

const serviceAccount = {
  type: process.env.GOOGLE2_TYPE,
  project_id: process.env.GOOGLE2_PROJECT_ID,
  private_key_id: process.env.GOOGLE2_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE2_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.GOOGLE2_CLIENT_EMAIL,
  client_id: process.env.GOOGLE2_CLIENT_ID,
  auth_uri: process.env.GOOGLE2_AUTH_URI,
  token_uri: process.env.GOOGLE2_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.GOOGLE2_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.GOOGLE2_CLIENT_X509_CERT_URL,
  universe_domain: process.env.GOOGLE2_UNIVERSE_DOMAIN,
};

let staffPortalApp;
if (!admin.apps.some(app => app.name === "staff-portal")) {
  staffPortalApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://amniportal.firebaseio.com",
    projectId: serviceAccount.project_id,
  }, "staff-portal");
} else {
  staffPortalApp = admin.app("staff-portal");
}

const staffPortalFirestore = getFirestore(staffPortalApp);

module.exports = { 
    firestore: staffPortalFirestore 
};
