
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const VendorSchema = new Schema({
    IdEntreprise: String,
    CompliancyStatement: String,
    ReleaseDate: String,
    ReleaseName: String,
    Comment: String,
    Sw_Categorisation: String,
    Cost_Covered : String,
    Vendors_Feature_Name :String
})

const vendors_responses = mongoose.model('vendors_responses', VendorSchema);

module.exports = vendors_responses;