import {bootstrap} from "angular2/platform/browser";
import {provide} from "angular2/core";
import {ROUTER_PROVIDERS, APP_BASE_HREF, LocationStrategy, HashLocationStrategy} from "angular2/router";
import {ApplicationComponent} from "app/app.component";

bootstrap(ApplicationComponent, [
    ROUTER_PROVIDERS,
    provide(APP_BASE_HREF, {useValue: '/'}),
    provide(LocationStrategy, {useClass: HashLocationStrategy})
]);
