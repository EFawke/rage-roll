const express = require('express');
const aboutRouter = express.Router();

aboutRouter.get(`/`, (req, res, next) => {
    const string = `Welcome to our website! We are thrilled to present to you a unique project designed to analyze the market for Tech 3 subsystems in the highly popular online game, EVE Online. Our goal is to provide valuable insights and data that will empower T3 manufacturers to make informed decisions and enhance their manufacturing strategies. In order to accomplish this, we have developed a sophisticated system that collects data from two essential sources: zKillboard and the evepraisal API. We are immensely grateful for their contribution to our project, as their data forms the backbone of our analysis. Our website offers two distinct features to cater to the needs of T3 manufacturers. Firstly, the "Subsystem Loss Tracker" allows you to explore detailed information on recently destroyed subsystems. By studying these losses, you can gain valuable insights into the market trends and adjust your production accordingly. Additionally, we provide a comprehensive "Market Data" section where you can access the latest market information. This includes pricing trends, supply and demand dynamics, and other essential data points that can assist you in making strategic decisions about what to build. We firmly believe that our project will be immensely beneficial to the T3 manufacturing community. By leveraging the power of data-driven analysis, we aim to enable manufacturers like you to optimize their production processes and maximize their profitability. We also invite you to contribute to our project. Your insights and expertise can further enhance the accuracy and usefulness of our data. To get involved, please reach out to Tradesy in-game, and let's collaborate to make this resource even more valuable.`
    res.status(200).send(string);
})

module.exports = aboutRouter;