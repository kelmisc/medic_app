'use strict';
const express = require('express'),
  router = express.Router();
const moment = require('moment');
const db = require('../config/db.config');
const jwt = require("jsonwebtoken");
const e = require('express');
const jwtKey = "my_secret_key"

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401) // if there isn't any token

    jwt.verify(token, jwtKey, (err, payload) => {
        console.log(err)
        if (err) return res.sendStatus(403)

        console.log(payload.email);
        req.body.clinic = payload.email;
        next() 
    })
}


router.post('/new', authenticateToken, function(req, res) {
    let buildInsertSQL = (
        clinic,
        doctor,
        patient,
        diagnosis,
        medication,
        fee,
        consultDate,
        consultTime,
        followup
    ) => {
        let sql = `
            INSERT INTO consultations(clinic_id, doctor, patient, diagnosis, medication, fee, consultDate, consultTime, followup) 
            VALUES ((select id from users where email = ${db.escape(clinic)}),${db.escape(doctor)},${db.escape(patient)},${db.escape(diagnosis)},
            ${db.escape(medication)},${db.escape(fee)},${db.escape(consultDate)},${db.escape(consultTime)},${followup?1:0})
        `;

        return sql;
    };

    let sql = buildInsertSQL(
        req.body.clinic,
        req.body.doctor,
        req.body.patient,
        req.body.diagnosis,
        req.body.medication,
        req.body.fee,
        req.body.consultDate,
        req.body.consultTime,
        req.body.followup,
    );

    db.query(sql, function(err, data, fields) {
        if (err) throw err;
        
        res.json({status: 200})
    })
});

router.post('/list', authenticateToken, function(req, res) {
    let ref = req.body.refDate;
    let email = req.body.clinic;

    let condition = '';
    if(req.body.mode == 0){
        condition =`(consultDate = ${db.escape(ref)})`;
    }else if(req.body.mode == 1){
        let curr = moment(ref);
        var monday = curr.clone().weekday(1);
        var sunday = curr.clone().weekday(7);
        condition = `(consultDate between CAST(${db.escape(monday.toISOString())} AS DATETIME) and CAST(${db.escape(sunday.toISOString())} AS DATETIME))`;
    }else{
        condition = `(MONTH(consultDate) = MONTH(CAST(${db.escape(ref)} AS DATETIME)) and YEAR(consultDate) = YEAR(CAST(${db.escape(ref)} AS DATETIME)))`;
    }

    let select =  `Select record.* from consultations record inner join users user on (user.id = record.clinic_id and user.email =  ${db.escape(email)}) where 1=1 and`
    db.query(select.concat(condition), function(err, data, fields) {
        if (err) throw err;

        res.json({records:data});
    })
});

module.exports = router;