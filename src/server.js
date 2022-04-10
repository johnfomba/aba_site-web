
//library
const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const upload = require('express-fileupload')
const fs = require('fs')
const csv = require('csvtojson')

// import entreprise
const entreprises = require('../Models/Entreprise')

const db_link = "mongodb://localhost:27017/aba"
const server = express()

// Set View
server.set('Views', './Views');
server.set('view engine', 'ejs')

//module used by server
server.use(bodyParser.urlencoded({ extended: false }));
server.use("/Public", express.static('./Public/'));
server.use(upload());

// connexion a la base de données.
mongoose.connect(db_link)
    .then((_result) => console.log("success : Server conneted to mongoDB"))
    .catch((err) => console.log("error : Server not connected ' " + err + " '"))

// recuperation des données 
/*entreprises.find({ Language: 'english', RequirementCategory: 'EA Principale', text: { $search: 'geo redundant' } })
    .then((result) => {
        result.forEach((entreprise) => console.log(entreprise + "\n"))
        if (result) { console.log("success : recovered data") }
    })
    .catch((err) => console.log("error : " + err))
*/
// traitement des rêquetes du client
server.get('/', (_req, res) => {
    res.render('load', { message: "" });
})

server.post('/load', (req, res) => {
    if (req.files) {
        let file = req.files.excelfile;
        let filename = file.name;
        let uploadPath = __dirname + '/Upload/' + filename;
        file.mv(uploadPath, async (err_load) => {
            if (err_load) {
                res.render('load', { message: "Failed: the file was not uploaded." });
            } else {
                const data_json = await csv().fromFile(uploadPath);
                if (data_json[0].Id && data_json[0].RequirementCategory && data_json[0].Requirements && data_json[0].Title) {
                    data_json.forEach(async (objet) => {
                        let resultat = await entreprises.findOne({ Id: objet.Id });
                        if (resultat == null) {
                            const entreprise = new entreprises({
                                Id: objet.Id,
                                RequirementCategory: objet.RequirementCategory,
                                Requirements: objet.Requirements,
                                Title: objet.Title,
                                Business: objet.Business,
                                Respons: objet.Response,
                                Language: objet.Language
                            })
                            await entreprise.save();
                        }
                    });
                    console.log("success : data inserted");
                    res.redirect("/request");
                } else {
                    res.render('load', { message: "Failed: check csv headers" });
                }
                fs.unlinkSync(uploadPath);
            }
        });
    } else {
        console.log("fichier inexistant")
    }
})

server.get('/request', (_req, res) => {
    res.render('request');
})

server.get('/request/search', async (req, res) => {
    var data = await entreprises.find({ language: req.query.language, Business: req.query.Business, RequirementCategory: req.query.requirementCategory, $text: { $search: req.query.keywords } });
    res.render("result", { entreprises: data });
})

server.get('/result', (_req, res) => {
    res.render("result", { entreprises: [] });
})

server.get('/about', (_req, res) => {
    res.sendFile("about.html", {
        root: path.join(__dirname, "../Views")
    })
})


server.listen(2000, () => {
    console.log("The server is listening on port 2000")
})

