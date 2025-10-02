const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");
const serviceAccount = require("../config/serviceAccountKey.json");

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
