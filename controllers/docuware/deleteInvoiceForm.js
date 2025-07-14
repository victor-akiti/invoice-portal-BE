const { Error500Handler } = require("../../errorHandling/errorHandlers");
const { sendBasicResponse } = require("../../helpers/response");
const { FormModel } = require("../../models/form");
const { InvoiceFormModel } = require("../../models/invoice");

exports.deleteInvoiceForm = async (req, res, next) => {
    try {
        const {formID} = req.params

        console.log({formID});
        

        if (!formID) {
            throw new Error400Handler("A form ID is required to fetch this form.")
        }

        //Delete form and return response
        const deletedForm = await InvoiceFormModel.findOneAndDelete({_id: formID})

        console.log({deletedForm});
        

        if (deletedForm) {
            //Get all forms and return response
            sendBasicResponse(res, {})
        } else {
            throw new Error500Handler("An error occured and the form couldn't be deleted. Please try again later.")
        }
        
    } catch (error) {
        next(error)
    }
}