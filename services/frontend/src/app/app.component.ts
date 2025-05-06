import {NgDompurifySanitizer} from "@tinkoff/ng-dompurify";
import {TUI_SANITIZER, TuiAlertModule, TuiDialogModule, TuiRootModule} from "@taiga-ui/core";
import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {SmileyAnimationComponent} from "./modules/cabinet/components/smiley-animation/smiley-animation.component";
import {TOXIC_STATE_TOKEN} from "./modules/cabinet/data/tokens/toxic-state.token";
import {Subject} from "rxjs";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, TuiRootModule, TuiDialogModule, TuiAlertModule, SmileyAnimationComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    providers: [
        { provide: TUI_SANITIZER, useClass: NgDompurifySanitizer },
        { provide: TOXIC_STATE_TOKEN, useValue: new Subject() }
    ]
})
export class AppComponent {
    title = 'frontend';
}
