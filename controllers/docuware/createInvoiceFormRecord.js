const { importRandomStringGen } = require("../../helpers/randomTextGen");
const { InvoiceFormModel } = require("../../models/invoice");


exports.createInvoiceFormRecord = async (req, res, next) => {
 try {
    console.log({body: req.body});
    //Check if body exists 
    if (!req.body) {
        //Throw error

        //Send email to app admin
    }


    //Check if required fields are filled
    const {CONTRACTOR_NAME, DOCUMENT_NUMBER, STATUS, TENDER_STRATEGY, DOCUMENT_TITLE, CURRENCY, CONTRACT_VALUE, DATE, DEPARTMENT, AMNI_ENTITY, SPONSORING_DEPARTMENT, BUDGET_CODE, CONTRACT_NUMBER, PR_NUMBER, CALL_OFF_NUMBER} = req.body

    console.log({CONTRACTOR_NAME, DOCUMENT_NUMBER, STATUS, TENDER_STRATEGY, DOCUMENT_TITLE, CURRENCY, CONTRACT_VALUE, DATE, DEPARTMENT});

    //Generate invoice code
    const cryptoRandomString = await importRandomStringGen()
    const hash = cryptoRandomString

    console.log({hash});

    //Create new invoice record
    const newInvoiceRecord = new InvoiceFormModel({CONTRACTOR_NAME, DOCUMENT_NUMBER, STATUS, TENDER_STRATEGY, DOCUMENT_TITLE, CURRENCY, CONTRACT_VALUE, DATE, DEPARTMENT, AMNI_ENTITY, SPONSORING_DEPARTMENT, BUDGET_CODE, CONTRACT_NUMBER, PR_NUMBER, INVOICE_CODE: hash, CALL_OFF_NUMBER} )

    //Save new invoice record
    const savedNewInvoice = await newInvoiceRecord.save()

    console.log({savedNewInvoice});

    res.status(200).send({status: "OK"})



 } catch (error) {
    next(error)
 }
}