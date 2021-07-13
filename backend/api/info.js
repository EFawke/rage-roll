const express = require('express');
const infoRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('zkill.db');

infoRouter.get(`/totalClassDestroyed/:class`, (req, res, next) => {
    let query;
    if (req.params.class === 'Marauders') {
        query = "('28661', '28665', '28659', '28710');"
    }
    if (req.params.class === 'Dreadnoughts') {
        query = "('19720', '19726', '19724', '19722');"
    }
    if (req.params.class === 'AllC5RattingShips') {
        query = "('33472', '47271', '19720', '19726', '19724', '19722', '28661', '28665', '28659', '28710');"
    }
    db.all(`SELECT * FROM esi WHERE ship_type_id IN ${query}`, (err, rows) => {
        if (err) {
            console.log(err)
        } else {
            const data = rows.length;
            const totalClassDestroyed = JSON.parse(data);
            res.send({ totalClassDestroyed })
        }
    })
})

infoRouter.get(`/totalDestroyed/:shipName`, (req, res, next) => {
    const shipName = req.params.shipName;
    const shipTypeId = shipSelector(shipName);
    db.all(`SELECT * FROM esi WHERE ship_type_id = '${shipTypeId}';`, (err, rows) => {
        if (err) {
            console.log(err)
        } else {
            const data = rows.length;
            const totalDestroyed = JSON.parse(data);
            res.send({ totalDestroyed })
        }
    })
})

const shipSelector = (shipType) => {
    let shipTypeId = ''
    if (shipType === 'Golem') {
        return shipTypeId = 28710;
    }
    if (shipType === 'Paladin') {
        return shipTypeId = 28659
    }
    if (shipType === 'Vargur') {
        return shipTypeId = 28665
    }
    if (shipType === 'Kronos') {
        return shipTypeId = 28661
    }
    if (shipType === 'Revelation') {
        return shipTypeId = 19720
    }
    if (shipType === 'Phoenix') {
        return shipTypeId = 19726
    }
    if (shipType === 'Moros') {
        return shipTypeId = 19724
    }
    if (shipType === 'Naglfar') {
        return shipTypeId = 19722
    }
    if (shipType === 'Gila') {
        return shipTypeId = 17715
    }
    if (shipType === 'Praxis') {
        return shipTypeId = 47466
    }
    if (shipType === 'Nestor') {
        return shipTypeId = 33472
    }
    if (shipType === 'Leshak') {
        return shipTypeId = 47271
    }
    if (shipType === 'Rattlesnake') {
        return shipTypeId = 17918
    }
    if (shipType === 'Heron') {
        return shipTypeId = 605
    }
    return shipTypeId;
}

module.exports = infoRouter;