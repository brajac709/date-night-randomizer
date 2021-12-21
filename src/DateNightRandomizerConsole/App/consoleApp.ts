import { RandomizerApp } from "./randomizerApp";
import { promisify } from "util";
import  * as readline from "readline";
import {stdin, stdout} from "process";

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
    }

    private async popEventMenu() {
        console.log("popEventMenu")
    }

    private async recyclePoppedEventsMenu() {
        console.log("recyclePoppedEventsMenu")
    }

    private async listPoppedEventsMenu() {
        console.log("listPoppedEventsMenu")
    }

    private async numberOfEventsMenu() {
        console.log("numberOfEventsMenu")
    }
}