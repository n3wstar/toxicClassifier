import {Component, input, InputSignal} from "@angular/core";
import {DecimalPipe, NgClass, PercentPipe} from "@angular/common";

@Component({
    standalone: true,
    selector: 'progress-bar',
    templateUrl: './progress-bar.component.html',
    imports: [
        NgClass,
        DecimalPipe,
        PercentPipe
    ],
    styleUrls: ['./styles/progress-bar.component.scss'],
})
export class ProgressBarComponent {
    public readonly value: InputSignal<number> = input.required();
    public readonly titleText: InputSignal<string> = input.required();
    public readonly subtitleText: InputSignal<string> = input('');
}
