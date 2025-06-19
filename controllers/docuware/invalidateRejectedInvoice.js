const { rejectedInvoiceEmailTemplate } = require("../../helpers/emailTemplates");
const { sendMail } = require("../../helpers/mailer");
const { InvoiceRecordModel } = require("../../models/invoiceRecord");

exports.invalidateRejectedInvoice = async (req, res, next) => {
    try {
       console.log({body: req.body});
       //Check if body exists 

       const {INVOICE_RECORD_ID, COMMENT} = req.body

       console.log({INVOICE_RECORD_ID});


       //Update invoice record
       const updatedInvoiceRecord = await InvoiceRecordModel.findOneAndUpdate({_id: INVOICE_RECORD_ID}, {status: "Rejected"}, {new: true}).populate("INVOICE_FORM_ID")

       const invoiceFormLink = `${process.env.FRONTEND_URL}/invoice/${updatedInvoiceRecord?.INVOICE_FORM_ID?.INVOICE_CODE}`


       emailContractorOnInvoiceRejection(invoiceFormLink, updatedInvoiceRecord.INVOICE_NUMBER, COMMENT, updatedInvoiceRecord.CONTRACTOR_EMAIL, updatedInvoiceRecord?.INVOICE_FORM_ID?.DEPARTMENT)
       

       res.status(200).send({status: "OK"})

   
   
   
    } catch (error) {
       next(error)
    }
   }


   const emailContractorOnInvoiceRejection = async (invoiceLink, invoiceNumber, rejectionReason, contractorEmail, department) => {
      try {
               //Send an email to the administrator or the person who sent the invite to inform them that the user they invited has completed their registration.
               const sendInviteEmail = await sendMail({
                   to: contractorEmail,
                  //  bcc: req.user.email,
                   subject: "Rejected Invoice",
                   html: rejectedInvoiceEmailTemplate({
                       invoiceLink, invoiceNumber, rejectionReason, department
                   }).html,
                   text: rejectedInvoiceEmailTemplate({
                    invoiceLink, invoiceNumber, rejectionReason, department
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