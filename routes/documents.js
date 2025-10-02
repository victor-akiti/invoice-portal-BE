const express = require("express");
const router = express.Router();
const { getDocumentInfo } = require("../controllers/documents");

router.get("/:docNumber", getDocumentInfo);

module.exports = router;
