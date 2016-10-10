import {bootstrap} from "angular2/platform/browser";
import {provide} from "angular2/core";
import {ROUTER_PROVIDERS} from "angular2/router";
import {APP_BASE_HREF, LocationStrategy, HashLocationStrategy} from "angular2/platform/common"
import {ApplicationComponent} from "./app.component";

bootstrap(ApplicationComponent, [
    ROUTER_PROVIDERS,
    provide(APP_BASE_HREF, {useValue: '/'}),
    provide(LocationStrategy, {useClass: HashLocationStrategy})
]);
