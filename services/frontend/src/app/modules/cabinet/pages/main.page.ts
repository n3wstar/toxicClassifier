import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    inject, signal,
    ViewChild,
    WritableSignal
} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {TuiButtonModule, TuiTextfieldControllerModule} from "@taiga-ui/core";
import {TuiTextareaModule} from "@taiga-ui/kit";
import {ProgressBarComponent} from "../components/progress-bar/progress-bar.component";
import { ToxicClassificationRequestService } from "../services/toxic-classification-request.service";
import {Subject, take} from "rxjs";
import {TOXIC_STATE_TOKEN} from "../data/tokens/toxic-state.token";
import {IPredictResponse} from "../data/response-models/predict.response-model.interface";

@Component({
    standalone: true,
    templateUrl: './main.page.html',
    styleUrls: ['./styles/main.page.scss'],
    imports: [
        FormsModule,
        TuiButtonModule,
        TuiTextareaModule,
        TuiTextfieldControllerModule,
        ProgressBarComponent
    ],
    providers: [
        ToxicClassificationRequestService
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainPage {
    @ViewChild('searchInput')
    protected readonly searchInput!: ElementRef<HTMLTextAreaElement>;

    protected inputText: string = '';
    protected result: { toxicity: number } | null = null;
    protected readonly confidenceState: WritableSignal<number> = signal(0);

    private readonly _toxicClassificationRequestService: ToxicClassificationRequestService = inject(ToxicClassificationRequestService);
    private readonly _toxicState$: Subject<number> = inject(TOXIC_STATE_TOKEN);
    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    protected analyzeText(): void {
        if (!this.inputText.trim()) {
            this.result = null;

            return;
        }

        this._toxicClassificationRequestService.sendRequest(this.inputText)
            .pipe(
                take(1)
            )
            .subscribe((result: IPredictResponse) => {
                switch (result.prediction) {
                    case 'NORMAL':
                        this.result = { toxicity: 0.1 };
                        break;
                    case 'TOXIC':
                        this.result = { toxicity: 0.9 };
                        break;
                }

                this._toxicState$.next(this.result?.toxicity!)
                this._cdr.detectChanges();

                this.confidenceState.set(result.confidence);

                setTimeout(() => { this.smoothScrollToBottom() })
            });
    }

    protected setFocusOnInput(): void {
        this.searchInput.nativeElement.focus();
        this.searchInput.nativeElement.value = '';
        this.result = null;

        this.smoothScrollToBottom();
    }

    private smoothScrollToBottom(): void {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    }
}