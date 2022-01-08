import { RandomizerApp } from "./randomizerApp";
import { promisify } from "util";
import  * as readline from "readline";
import {stdin, stdout} from "process";
import { DateNightData } from "./dateNightData";
import { ConfigManager } from "./configManager";
import  express from "express";

const enterToContinue = "Press ENTER to continue...";

interface MenuOption {
    prompt : string,
    fcn : () => Promise<void>
}

const buildMenuString = (options : string[], prompt? : string[]) : string => {
    if (prompt === undefined) {
        prompt = [ "Select Option:"]
    }
    const lines = [
        "*********************", 
        ...prompt,
        ...options.map((val, idx) => `  ${idx+1}. ${val}`),
        "  Else. Exit",
        "Enter? ",
    ];

    return lines.reduce((acc, val) => acc + val + "\n", "");
}

export class WebApp {
    private readonly _randomizerApp : RandomizerApp;
    private readonly _rl : readline.ReadLine;
    private readonly _question : (query:string ) => Promise<string>; 

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

    constructor(randomizerApp : RandomizerApp) {
        this._randomizerApp = randomizerApp;
        this._rl = readline.createInterface(stdin, stdout)
        this._question = promisify(this._rl.question).bind(this._rl);
    }


    async run() {
        const app = express();
        const port = 3000;

        app.get('/', (req,res) => {
            res.send('Hello World!!!')
        });

        app.listen(port, () => {
            console.log(`Web App listening at http://localhost:${port}`);
        });
    }

    private async mainMenu() {
        const configManager = await ConfigManager.getInstance();

        const debugMode = configManager.get("debugMode");

        const options = [...this._menuOptions];
        if (debugMode) {
            options.push(...this._debugOptions);
        }

        const menuString = buildMenuString(options.map(val => val.prompt));
        const response = await this._question(menuString);


        const idx = Number.parseInt(response);
        if (Number.isNaN(idx)) {
            return -1;
        }

        const entry = options[idx-1];
        if (entry === undefined) {
            return -1;
        }

        await entry.fcn.bind(this)();
        return idx;
    }

    private async addEventMenu() {
        console.log("Add Event:");
        const name = await this._question("Event Name: ");
        const desc = await this._question("Event Description: ");

        const event : DateNightData = {
            eventName : name,
            eventDescription : desc
        };

        await this._randomizerApp.addEvent(event);
        const _ = await this._question(enterToContinue);
    }

    private async popEventMenu() {
        console.log("Popping Event...");
        const event = await this._randomizerApp.popEvent();

        console.log(event);
        const _ = await this._question(enterToContinue);
    }

    private async recyclePoppedEventsMenu() {
        console.log("Recycling events...");
        await this._randomizerApp.recyclePoppedEvents();
        const _ = await this._question(enterToContinue);
    }

    private async listPoppedEventsMenu() {
        var events = this._randomizerApp.getPoppedEvents();

        console.log("Popped Events: ");
        console.log(JSON.stringify(events,null, 2));
        const _ = await this._question(enterToContinue);
    }

    private async listEventsMenu() {
        var events = this._randomizerApp.getEvents();

        console.log("Events: ");
        console.log(JSON.stringify(events,null, 2));
        const _ = await this._question(enterToContinue);
    }

    private async numberOfEventsMenu() {
        var num = this._randomizerApp.numberOfEvents();
        console.log(`Number of Events Remaining: ${num}`);

        const _ = await this._question(enterToContinue);
    }

    private async removePoppedEventMenu() {
        const events = this._randomizerApp.getPoppedEvents();
        
        await this.removeGeneralMenu(
            events, 
            this._randomizerApp.removePoppedEvent.bind(this._randomizerApp));
    }

    private async removeEventMenu() {
        const events = this._randomizerApp.getEvents();

        await this.removeGeneralMenu(
            events, 
            this._randomizerApp.removeEvent.bind(this._randomizerApp));
    }

    private async removeGeneralMenu(
        events : readonly DateNightData[], 
        removeFcn : (idx :number) => Promise<void>) 
    {
        const prompt = [
            "Select Event To Remove",
            "(Negative to print description)",
        ]

        const options = events.map(val => val.eventName);

        const menuString  = buildMenuString(options, prompt);

        while (true) {
            const response = await this._question(menuString);

            let idx = Number.parseInt(response);
            if (Number.isNaN(idx)) {
                break;
            }

            let showDesc = false;
            if (idx < 0) {
                showDesc = true;
                idx *= -1;
            }

            const entry = events[idx-1];
            if (entry === undefined) {
                break
            }

            if (showDesc) {
                console.log(entry.eventDescription);
                const _ = await this._question(enterToContinue);
            } else {
                await removeFcn(idx-1);
                console.log("Event removed");
                const _ = await this._question(enterToContinue);
                break;
            }
        }
    }

    private async reinitializeMenu() {
        await this._randomizerApp.reinitializeSettings();

        console.log("Settings Reset");

        const _ = await this._question(enterToContinue);
    }
}