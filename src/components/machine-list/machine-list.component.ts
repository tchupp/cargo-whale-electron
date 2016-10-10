import {Component} from "angular2/core";

class Machine {
    name: string;
    driver: string;
}

const MACHINES: Machine[] = [
    {name: 'home', driver: 'generic'},
    {name: 'dg main', driver: 'digital ocean'}
];

@Component({
    selector: 'cw-machine-list',
    templateUrl: 'components/machine-list/machine-list.html'
})

export class MachineList {
    machines: Machine[] = MACHINES;
}
