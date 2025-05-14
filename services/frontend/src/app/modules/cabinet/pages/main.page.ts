import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    inject,
    signal,
    ViewChild,
    WritableSignal
} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {TuiButtonModule, TuiTextfieldControllerModule} from "@taiga-ui/core";
import {TuiTextareaModule} from "@taiga-ui/kit";
import {ProgressBarComponent} from "../components/progress-bar/progress-bar.component";
import {ToxicClassificationRequestService} from "../services/toxic-classification-request.service";
import {BehaviorSubject, take} from "rxjs";
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
    protected readonly confidenceState: WritableSignal<number> = signal(0);
    protected readonly toxicState$: BehaviorSubject<'TOXIC' | 'NORMAL' | null> = inject(TOXIC_STATE_TOKEN);

    private readonly _toxicClassificationRequestService: ToxicClassificationRequestService = inject(ToxicClassificationRequestService);
    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    protected resetForm(): void {
        this.searchInput.nativeElement.value = '';
        this.confidenceState.set(0);
    }

    protected analyzeText(): void {
        if (!this.inputText.trim()) {
            return;
        }

        this._toxicClassificationRequestService.sendRequest(this.inputText)
            .pipe(
                take(1)
            )
            .subscribe((result: IPredictResponse) => {
                this.toxicState$.next(result.prediction)
                this.confidenceState.set(result.confidence);

                this._cdr.detectChanges();

                setTimeout(() => {
                    this.smoothScrollToBottom()
                })
            });
    }

    protected setFocusOnInput(): void {
        this.searchInput.nativeElement.focus();
        this.searchInput.nativeElement.value = '';

        this.smoothScrollToBottom();
    }

    private smoothScrollToBottom(): void {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    }
}
