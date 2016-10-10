import {Component} from "angular2/core";

const MACHINES = [
    {name: 'home', driver: 'generic'},
    {name: 'dg main', driver: 'digital ocean'}
];

@Component({
    selector: 'cw-machine-list',
    templateUrl: 'machine-list.html'
})

export class MachineList {
    machines = MACHINES;
}
