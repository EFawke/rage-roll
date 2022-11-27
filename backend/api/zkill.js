const express = require('express');
const zkillRouter = express.Router();
const axios = require('axios');
const esiDbInit = require('../utils/esiDbInit');
const zkillDbInit = require('../utils/zkillTableInit');
const shipTableInit = require('../utils/shipTableInit')
const insertValuesIntoTable = require('../utils/shipInserter.js')
// const logThisStuff = require('../utils/grabShipData')
var format = require('pg-format');
const { Client } = require('pg');
const { query, response } = require('express');

// logThisStuff();
// esiDbInit();
// zkillDbInit();
// shipTableInit();
// insertValuesIntoTable();

const dateToDay = (date) => {
    const killDate = new Date(date);
    const dayIndex = killDate.getDay();
    switch (dayIndex) {
        case 0:
            day = "Sunday";
            break;
        case 1:
            day = "Monday";
            break;
        case 2:
            day = "Tuesday";
            break;
        case 3:
            day = "Wednesday";
            break;
        case 4:
            day = "Thursday";
            break;
        case 5:
            day = "Friday";
            break;
        case 6:
            day = "Saturday";
    }
    return day;
}

const axiosZkillData = (page) => {
    let query;
    if (page === 0) {
        query = 'https://zkillboard.com/api/kills/w-space/'
    } else {
        query = `https://zkillboard.com/api/kills/w-space/page/${page}/`
    }
    return axios.get(query,
        {
            headers: {
                'accept-encoding': 'gzip',
                'user-agent': 'Johnson Kanjus - rage-roll.com - teduardof@gmail.com',
                'connection': 'close'
            }
        })
        .catch(err => {
            if (err) {
                return;
            }
        })
        .then(response => {
            if(response === undefined){
                console.log('response came back undefined for page ' + page)
            } else {
                // console.log(`page ${page} came back ok`)
                return response.data
            }
        })
}

const lookUpEsi = (wormholeData, id) => {
    if (wormholeData === undefined) {
        console.log('wormholedata came back undefined')
        return;
    }
    for (let i = 0; i < Object.keys(wormholeData).length; i++) {
        const newzKillId = Object.keys(wormholeData)[i]
        const currentHash = Object.values(wormholeData)[i]
        if(Number(id) < Number(newzKillId)){
            // console.log('fetching esi data')
            axios.get(`https://esi.evetech.net/latest/killmails/${newzKillId}/${currentHash}/?datasource=tranquility`)
                .catch(err => {
                    console.log(err)
                })
                .then(res => {
                    sqlInject(res)
                })
        }
    }
}

const sqlInject = (response) => {
    if(response === undefined){
        //responses come back undefined during downtime, causing the app to crash
        return
    }
    const id = response.data.killmail_id
    const date = response.data.killmail_time
    const ship = response.data.victim.ship_type_id
    const day = dateToDay(response.data.killmail_time)
    let client;

    if (!process.env.DATABASE_URL) {
      client = new Client()
    } else {
      client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        },
        allowExitOnIdle: true
      });
    }
    client.connect()
    client.query(`INSERT INTO esi (killmail_id, killmail_time, ship_type_id, weekday) VALUES ('${id}', '${date}', '${ship}', '${day}')`, (err, res) => {
        client.end()
        if (err) {
            client.end()
            // console.log('value already inserted, probably')
        } else {
            client.end()
            // console.log('esi value inserted');
        }
    })
}

const insertIntoEsiDatabase = async (num, id) => {
    await axiosZkillData(num).then((wormholeData) => {
        //we shall see if this is suitable. zkill doesn't want more than one request a second.
        lookUpEsi(wormholeData, id);
    })
}

const go = async (id) => {
    console.log(id)
    for (let i = 5; i >= 0; i--) {
        await insertIntoEsiDatabase(i, id)
    }
}

const fillDbs = async () => {
    let client;

    if (!process.env.DATABASE_URL) {
      client = new Client()
    } else {
      client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        },
        allowExitOnIdle: true
      });
    }
    client.connect()
    return client.query(`SELECT MAX (killmail_id) FROM esi`)
    .catch(err => {
        client.end()
        console.log(err)
    })
    .then(res => {
        client.end()
        console.log(res)
        // go(res.rows[0].max)
    })
}

fillDbs()
setInterval(fillDbs, 1000 * 60 * 10);

module.exports = zkillRouter;