const { invoiceSubmissionFormLinkTemplate } = require("../../helpers/emailTemplates");
const { sendMail } = require("../../helpers/mailer");
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
    const {CONTRACTOR_NAME, DOCUMENT_NUMBER, STATUS, TENDER_STRATEGY, DOCUMENT_TITLE, CURRENCY, CONTRACT_VALUE, DATE, DEPARTMENT, AMNI_ENTITY, SPONSORING_DEPARTMENT, BUDGET_CODE, CONTRACT_NUMBER, PR_NUMBER, CALL_OFF_NUMBER, PAYMENT_TERMS, PAYMENT_OPTION, DWSTOREUSER, STORE_USER, ANALYST_EMAIL, OTHER_CONTRACT_VALUE, OTHER_CURRENCY, OTHER_CURRENCY_REQUIRED} = req.body

    console.log({CONTRACTOR_NAME, DOCUMENT_NUMBER, STATUS, TENDER_STRATEGY, DOCUMENT_TITLE, CURRENCY, CONTRACT_VALUE, DATE, DEPARTMENT, STORE_USER, ANALYST_EMAIL, PAYMENT_OPTION, PAYMENT_TERMS});

    //Check if a record already exists for this document number
    const existingInvoiceRecord = await InvoiceFormModel.findOne({DOCUMENT_NUMBER})

    console.log({existingInvoiceRecord});
    

    if (existingInvoiceRecord) {
        //Update existing invoice record
        const updatedInvoiceRecord = await InvoiceFormModel.findOneAndUpdate({DOCUMENT_NUMBER}, {CONTRACTOR_NAME, DOCUMENT_NUMBER, STATUS, TENDER_STRATEGY, DOCUMENT_TITLE, CURRENCY, CONTRACT_VALUE, DATE, DEPARTMENT, AMNI_ENTITY, SPONSORING_DEPARTMENT, BUDGET_CODE, CONTRACT_NUMBER, PR_NUMBER, CALL_OFF_NUMBER, PAYMENT_TERMS, PAYMENT_OPTION, OTHER_CONTRACT_VALUE, OTHER_CURRENCY, OTHER_CURRENCY_REQUIRED}, {new: true})

        //Send email to contract analyst
        const invoiceFormLink = `${process.env.FRONTEND_URL}/invoice/${updatedInvoiceRecord.INVOICE_CODE}`

        // this.emailContractAnalystInvoiceFormLink( ANALYST_EMAIL, invoiceFormLink, CONTRACTOR_NAME)


        return res.status(200).send({status: "OK"})
    } else {
        //Generate invoice code
        const cryptoRandomString = await importRandomStringGen()
        const hash = cryptoRandomString

        console.log({hash});

        //Create new invoice record
        const newInvoiceRecord = new InvoiceFormModel({CONTRACTOR_NAME, DOCUMENT_NUMBER, STATUS, TENDER_STRATEGY, DOCUMENT_TITLE, CURRENCY, CONTRACT_VALUE, DATE, DEPARTMENT, AMNI_ENTITY, SPONSORING_DEPARTMENT, BUDGET_CODE, CONTRACT_NUMBER, PR_NUMBER, INVOICE_CODE: hash, CALL_OFF_NUMBER, PAYMENT_TERMS, PAYMENT_OPTION, OTHER_CONTRACT_VALUE, OTHER_CURRENCY, OTHER_CURRENCY_REQUIRED} )

        //Save new invoice record
        const savedNewInvoice = await newInvoiceRecord.save()

        //Send email to contract analyst
        const invoiceFormLink = `${process.env.FRONTEND_URL}/invoice/${savedNewInvoice.INVOICE_CODE}`

        this.emailContractAnalystInvoiceFormLink( ANALYST_EMAIL, invoiceFormLink, CONTRACTOR_NAME)



        res.status(200).send({status: "OK"})
    }
    



 } catch (error) {
    next(error)
 }
}

exports.emailContractAnalystInvoiceFormLink = async (analystEmail, link, contractorName) => {
   try {
            //Send an email to the administrator or the person who sent the invite to inform them that the user they invited has completed their registration.
            const sendInviteEmail = await sendMail({
                to: analystEmail,
               //  bcc: req.user.email,
                subject: "Invoice Submission Form Link",
                html: invoiceSubmissionFormLinkTemplate({
                    link, contractorName
                }).html,
                text: invoiceSubmissionFormLinkTemplate({
                    link, contractorName
                }).text
            })

            console.log({sendInviteEmail});
            
    
            // if (sendInviteEmail[0].statusCode === 202 || sendInviteEmail[0].statusCode === "202") {
            //     sendBasicResponse(res, {})
            // }
   } catch (error) {
      console.log({error});
      
   }
}

