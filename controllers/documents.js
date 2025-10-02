const { firestore } = require("../config/firebaseAdmin");

exports.getDocumentInfo = async (req, res) => {
  const { docNumber } = req.params;

  if (!docNumber) {
    return res.status(400).json({ error: "Document number is required" });
  }

  try {
    const parts = docNumber.split("-");
    if (parts.length < 6) {
      return res.status(400).json({ error: "Invalid document number format" });
    }

    // Contractor/Company code is the 3rd part
    const companyCode = parts[2].toUpperCase();

    // 🔎 Step 1: Check if document number exists in Firestore
    const docSnapshot = await firestore
      .collection("documentNumbers")
      .where("docNumber", "==", docNumber)
      .get();

    let documentEntry = null;
    let validDocNumber = false;

    if (!docSnapshot.empty) {
      documentEntry = docSnapshot.docs[0].data();
      validDocNumber = true;
    }

    // 🔎 Step 2: Look up contractor by code
    const snapshot = await firestore
      .collection("companyNames")
      .where("code", "==", companyCode)
      .get();

    let company = null;
    if (!snapshot.empty) {
      company = snapshot.docs[0].data();
    }

    return res.status(200).json({
      docNumber,
      validDocNumber,             // ✅ true/false based on DB check
      contractorCode: companyCode,
      contractor: company,
      contractorName: company?.companyName || null,
      documentEntry,
    });
  } catch (err) {
    console.error("Error fetching document info:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
