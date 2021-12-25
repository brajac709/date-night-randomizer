import { RandomizerApp } from "./randomizerApp";
import { promisify } from "util";
import  * as readline from "readline";
import {stdin, stdout} from "process";
import { DateNightData } from "./dateNightData";

const enterToContinue = "Press ENTER to continue...";

export class ConsoleApp {
    private readonly _randomizerApp : RandomizerApp;
    private readonly _rl : readline.ReadLine;
    private readonly _question : (query:string ) => Promise<string>; 

    constructor(randomizerApp : RandomizerApp) {
        this._randomizerApp = randomizerApp;
        this._rl = readline.createInterface(stdin, stdout)
        this._question = promisify(this._rl.question).bind(this._rl);
    }

    async run() {
        var done = false;

        while (!done) {
            const result = await this.mainMenu();
            if (result < 0) {
                done = true;
            }
        }

        this._rl.close();
    }

    private async mainMenu() {
        // TODO probably move this to a static namespace
        const menuString = 
        "*********************\n" +
        "Select Option:\n" + 
        "  1. Add Event\n" +
        "  2. Pop Event\n" + 
        "  3. Recycle Popped Event\n" + 
        "  4. List Popped Events\n" + 
        "  5. Number of events\n" +
        "  Else. Exit\n" +
        "Enter? \n"
        ;

        const response = await this._question(menuString);

        switch(response) {
            case "1":
                await this.addEventMenu();
                return 1;
            case "2":
                await this.popEventMenu();
                return 2;
            case "3":
                await this.recyclePoppedEventsMenu();
                return 3;
            case "4":
                await this.listPoppedEventsMenu();
                return 4;
            case "5":
                await this.numberOfEventsMenu();
                return 5;
            default:
                return -1
        }

    }

    private async addEventMenu() {
        console.log("addEventMenu")
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

    private async numberOfEventsMenu() {
        var num = this._randomizerApp.numberOfEvents();
        console.log("Number of Events Remaining: " + num);

        const _ = await this._question(enterToContinue);
    }
}