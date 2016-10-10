import {Component} from "angular2/core";

import {MachineList} from "components/machine-list/machine-list.component"

@Component({
    selector: 'cw-app',
    directives: [MachineList],
    templateUrl: 'app.html'
})

export class ApplicationComponent {
}
