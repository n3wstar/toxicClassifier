import {ChangeDetectionStrategy, Component, ElementRef, inject, ViewChild} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {TuiButtonModule, TuiTextfieldControllerModule} from "@taiga-ui/core";
import {TuiTextareaModule} from "@taiga-ui/kit";
import {ProgressBarComponent} from "../components/progress-bar/progress-bar.component";
import { ToxicClassificationRequestService } from "../services/toxic-classification-request.service";
import {take} from "rxjs";

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

    private readonly _toxicClassificationRequestService: ToxicClassificationRequestService = inject(ToxicClassificationRequestService);

    protected analyzeText(): void {
        if (!this.inputText.trim()) {
            this.result = null;

            return;
        }

        this._toxicClassificationRequestService.sendRequest(this.inputText)
            .pipe(
                take(1)
            )
            .subscribe((result: any) => this.result = result);

        // 🔥 Здесь можно интегрировать реальный API или ML модель
        // Для демо — случайное число от 0 до 1, как "токсичность"
        const randomToxicity = Math.random();

        // Устанавливаем результат
        this.result = {toxicity: randomToxicity};

        setTimeout(() => { this.smoothScrollToBottom() })
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