import { RandomizerApp } from "./randomizerApp";
import { promisify } from "util";
import { DateNightData } from "./dateNightData";
import { ConfigManager } from "./configManager";
import  express from "express";

export class WebApp {
    private readonly _randomizerApp : RandomizerApp;

    /*
    private readonly _menuOptions : MenuOption[] = [
        { prompt: "Add Event", fcn: this.addEventMenu },
        { prompt: "Pop Event", fcn: this.popEventMenu },
        { prompt: "Recycle Popped Event", fcn: this.recyclePoppedEventsMenu },
        { prompt: "List Popped Events", fcn: this.listPoppedEventsMenu },
        { prompt: "Number of Events", fcn: this.numberOfEventsMenu },
        { prompt: "Remove Popped Event", fcn: this.removePoppedEventMenu },
    ];

    private readonly  _debugOptions : MenuOption[] = [
        { prompt: "Reinitialize Settings", fcn: this.reinitializeMenu },
        { prompt: "List Events", fcn: this.listEventsMenu },
        { prompt: "Remove Event", fcn: this.removeEventMenu },
    ];
    */

    constructor(randomizerApp : RandomizerApp) {
        this._randomizerApp = randomizerApp;
    }


    async run() {
        const app = express();
        const port = 3000;

        const configManager = await ConfigManager.getInstance();

        const debugMode = configManager.get("debugMode");

        app.get('/', (req,res) => {
            res.send('Hello World!!!')
        });

        app.post('/event', express.json(), async (req, res) => {
            console.log("Adding Event");
            const event = req.body;
            await this._randomizerApp.addEvent(event)
            res.sendStatus(200).send("OK");
        });

        // TODO GET should not have side effects... 
        // Is there another verb i could use for this?
        app.get('/event', async (req, res) => {
            console.log("Popping Event...");
            const event = await this._randomizerApp.popEvent(); 

            console.log(event);
            res.sendStatus(200).json(event);
        });

        // TODO should this be off the popped endpoint?
        app.post('/events/recycle', async (req, res) => {
            console.log("Recycling events...");
            await this._randomizerApp.recyclePoppedEvents();
            res.sendStatus(200).send("OK");
        });

        // TODO may make this a query parameter
        // rather than a separate endpoint????
        // Maybe not... to handle debug mode appropriately...
        app.get('/events/popped', async (req, res) => {
            var events = this._randomizerApp.getPoppedEvents();

            console.log("Popped Events: ");
            console.log(JSON.stringify(events,null, 2));

            res.sendStatus(200).json(events);
        });

        app.get('/events', async (req, res) => {
            if (!debugMode) {
                // TODO maybe use error middleware??
                res.sendStatus(403).send("Forbidden");
                return
            }
            var events = this._randomizerApp.getEvents();

            console.log("Events: ");
            console.log(JSON.stringify(events,null, 2));

            res.sendStatus(200).json(events);
        });

        app.get('/events/count', async (req, res) => {
            var num = this._randomizerApp.numberOfEvents();
            console.log(`Number of Events Remaining: ${num}`);

            res.sendStatus(200).json(num);
        });

        app.delete('/events/popped/:id(\d+)', async (req, res) => {
            const idx = parseInt(req.params.id);
            await this._randomizerApp.removePoppedEvent(idx);
            res.sendStatus(200).send("OK");
        });

        app.delete('/events/:id(\d+)', async (req, res) => {
            if (!debugMode) {
                // TODO maybe use error middleware??
                res.sendStatus(403).send("Forbidden");
                return
            }
            const idx = parseInt(req.params.id);
            await this._randomizerApp.removeEvent(idx);
            res.sendStatus(200).send("OK");
        });

        app.post('/initialize', async (req, res) => {
            if (!debugMode) {
                // TODO maybe use error middleware??
                res.sendStatus(403).send("Forbidden");
                return
            }
            await this._randomizerApp.reinitializeSettings();

            console.log("Settings Reset");
            res.sendStatus(200).send("OK");
        });

        app.listen(port, () => {
            console.log(`Web App listening at http://localhost:${port}`);
        });
    }
}