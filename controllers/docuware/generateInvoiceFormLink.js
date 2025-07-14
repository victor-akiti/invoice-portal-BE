const { Error400Handler } = require("../../errorHandling/errorHandlers");
const { importRandomStringGen } = require("../../helpers/randomTextGen");
const { sendBasicResponse } = require("../../helpers/response");
const { InvoiceFormModel } = require("../../models/invoice");
const { emailContractAnalystInvoiceFormLink } = require("./createInvoiceFormRecord");

exports.generateInvoiceFormLink = async (req, res, next) => {
    try {
        const {contractNumber, contractorName} = req.body

        const user = req.userRecord

        console.log({user});
        

        if (!contractNumber) {
            throw new Error400Handler("Contract number is required")
        }

        //Check if a record already exists for this contract number
        const existingInvoiceFormLink = await InvoiceFormModel.findOne({DOCUMENT_NUMBER: contractNumber})

        if (existingInvoiceFormLink) {
            throw new Error400Handler("You have already generated an invoice form link for this contract number.")
        }

        const cryptoRandomString = await importRandomStringGen()
        const hash = cryptoRandomString

        const newInvoiceFormLink = new InvoiceFormModel({DOCUMENT_NUMBER: contractNumber, INVOICE_CODE: hash, CREATED_BY: user, CONTRACTOR_NAME: contractorName})

        const savedNewInvoiceFormLink = await newInvoiceFormLink.save()

        const invoiceFormLink = `${process.env.FRONTEND_URL}/invoice/${savedNewInvoiceFormLink.INVOICE_CODE}`

        //Send email to contract analyst
        emailContractAnalystInvoiceFormLink( user.email, invoiceFormLink, contractorName)



        sendBasicResponse(res, {invoiceCode: savedNewInvoiceFormLink.INVOICE_CODE})
        
        
        
    } catch (error) {
        next(error)
    }
}