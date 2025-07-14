const { createInvoiceFormRecord } = require("../controllers/docuware/createInvoiceFormRecord")
const { createNewInvoice, attachFilesToNewInvoice } = require("../controllers/docuware/createNewInvoice")
const { fetchInvoiceDetails, fetchAllSubmittedInvoices, fetchAllInvoiceForms } = require("../controllers/docuware/getInvoiceDetails")
const multer = require("multer")
const authenticate = require("../middleWare/authenticateRequests")
const { addDocuwareToken } = require("../middleWare/docuwareToken")
const { invalidateRejectedInvoice } = require("../controllers/docuware/invalidateRejectedInvoice")
const { generateInvoiceFormLink } = require("../controllers/docuware/generateInvoiceFormLink")
const { deleteInvoiceForm } = require("../controllers/docuware/deleteInvoiceForm")
const upload = multer({dest:  __dirname +  "/uploads"})

const Router = require("express").Router()

Router.post("/createInvoiceRecord", addDocuwareToken, createInvoiceFormRecord)
Router.get("/invoice/record/:invoiceCode", fetchInvoiceDetails)
Router.post("/invoice/new",addDocuwareToken, createNewInvoice)
Router.post("/invoice/attachFiles/:documentID", addDocuwareToken, upload.array("file"), attachFilesToNewInvoice)
Router.get("/invoice-forms/all", authenticate, fetchAllInvoiceForms)
Router.post("/invalidate", addDocuwareToken, invalidateRejectedInvoice)
Router.post("/invoice/form/generateLink", authenticate, generateInvoiceFormLink)
Router.delete("/invoice-forms/:formID", authenticate, deleteInvoiceForm)

module.exports = Router