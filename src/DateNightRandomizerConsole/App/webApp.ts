import { RandomizerApp } from "./randomizerApp";
import { promisify } from "util";
import { DateNightData } from "./dateNightData";
import { ConfigManager } from "./configManager";
import  express from "express";
import { exec } from "child_process"


const execAsync = promisify(exec);

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
        const setGitpodCORS = configManager.get("setGitpodCORS");
        const setAngularEnvironment = configManager.get("setAngularEnvironment");
        
        var allowedOrigin = "http://localhost:4200";
        if (setGitpodCORS) {
            const {stdout, stderr} = await execAsync("gp url 4200");
            console.log(stdout);
            allowedOrigin = stdout.trim();
        }

        // Enable CORS
        app.use((req,res,next) => {
            // TODO make the angular app url injectable
            res.header("Access-Control-Allow-Origin", allowedOrigin);
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header("Access-Control-Allow-Credentials", "true");
            next();
        })

        app.get('/', (req,res) => {
            res.send('Hello World!!!')
        });

        app.post('/api/event', express.json(), async (req, res) => {
            console.log("Adding Event");
            const event = req.body;
            await this._randomizerApp.addEvent(event)
            res.status(200).send("OK");
        });

        // TODO GET should not have side effects... 
        // Is there another verb i could use for this?
        app.get('/api/event', async (req, res) => {
            console.log("Popping Event...");
            const event = await this._randomizerApp.popEvent(); 

            console.log(event);
            res.status(200).json(event);
        });

        // TODO should this be off the popped endpoint?
        app.post('/api/events/recycle', async (req, res) => {
            console.log("Recycling events...");
            await this._randomizerApp.recyclePoppedEvents();
            res.status(200).send("OK");
        });

        // TODO may make this a query parameter
        // rather than a separate endpoint????
        // Maybe not... to handle debug mode appropriately...
        app.get('/api/events/popped', async (req, res) => {
            var events = this._randomizerApp.getPoppedEvents();

            console.log("Popped Events: ");
            console.log(JSON.stringify(events,null, 2));

            res.status(200).json(events);
        });

        app.get('/api/events', async (req, res) => {
            if (!debugMode) {
                // TODO maybe use error middleware??
                res.status(403).send("Forbidden");
                return
            }
            var events = this._randomizerApp.getEvents();

            console.log("Events: ");
            console.log(JSON.stringify(events,null, 2));

            res.status(200).json(events);
        });

        app.get('/api/events/count', async (req, res) => {
            var num = this._randomizerApp.numberOfEvents();
            console.log(`Number of Events Remaining: ${num}`);

            res.status(200).json(num);
        });

        app.delete('/api/events/popped/:id(\d+)', async (req, res) => {
            const idx = parseInt(req.params.id);
            await this._randomizerApp.removePoppedEvent(idx);
            res.status(200).send("OK");
        });

        app.delete('/api/events/:id(\d+)', async (req, res) => {
            if (!debugMode) {
                // TODO maybe use error middleware??
                res.status(403).send("Forbidden");
                return
            }
            const idx = parseInt(req.params.id);
            await this._randomizerApp.removeEvent(idx);
            res.status(200).send("OK");
        });

        app.post('/api/initialize', async (req, res) => {
            if (!debugMode) {
                // TODO maybe use error middleware??
                res.status(403).send("Forbidden");
                return
            }
            await this._randomizerApp.reinitializeSettings();

            console.log("Settings Reset");
            res.status(200).send("OK");
        });

        app.listen(port, () => {
            console.log(`Web App listening at http://localhost:${port}`);
        });
    }
}