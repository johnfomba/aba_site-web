
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const EntrepriseSchema = new Schema({
    Id: String,
    RequirementCategory: String,
    Requirements: String,
    Title: String,
    Business: String,
    Response: String,
    Language: String,
})

const entreprises = mongoose.model('entreprises', EntrepriseSchema);

module.exports = entreprises;