import {Component} from "angular2/core";

import {MachineList} from "../components/machine-list/machine-list"

@Component({
    selector: 'cw-app',
    directives: [MachineList],
    templateUrl: 'app.html'
})

export class Application {
}
