import {Component, ElementRef, inject, OnDestroy, signal, ViewChild, WritableSignal} from '@angular/core';
import {Subject} from "rxjs";
import { TOXIC_STATE_TOKEN } from '../../data/tokens/toxic-state.token';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
    standalone: true,
    selector: 'smiley-animation',
    templateUrl: './smiley-animation.component.html',
    styleUrls: ['./styles/smiley-animation.component.scss']
})
export class SmileyAnimationComponent implements OnDestroy {
    @ViewChild('smileyContainer', { static: true })
    public readonly smileyContainer!: ElementRef;

    protected readonly smiles: WritableSignal<Array<any>> = signal([]);
    private _animationId: number | null = null;
    private _lastTime: number = 0;

    private readonly _toxicityLevels: any = [
        { minPercent: 0.0, emojis: ['😊', '😇', '🙂', '😌', '🥰'] },
        { minPercent: 0.2, emojis: ['😐', '😶', '😏', '🤨', '🧐'] },
        { minPercent: 0.4, emojis: ['😒', '😕', '🙄', '😟', '🤔'] },
        { minPercent: 0.6, emojis: ['😠', '😤', '🤬', '👿', '💢'] },
        { minPercent: 0.8, emojis: ['👹', '👺', '💀', '☠️', '🤯'] },
        { minPercent: 0.95, emojis: ['💀☠️', '👿🔥', '🤬💣', '🖕⚰️', '💩🤮'] }
    ];

    private readonly _toxicState$: Subject<number> = inject(TOXIC_STATE_TOKEN);

    constructor() {
        this._toxicState$
            .pipe(
                takeUntilDestroyed()
            )
            .subscribe((state: number) => {
                const emojis: any[] = this.getSmileysForToxicity(state);

                this.startAnimation(emojis);
            });
    }

    public startAnimation(emojis: any): void {
        if (this._animationId) {
            cancelAnimationFrame(this._animationId);
            this.smiles.set([]);
        }

        for (let i = 0; i < 20; i++) {
            this.smiles().push({
                emoji: emojis[Math.floor(Math.random() * emojis.length)],
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 50,
                speedX: (Math.random() - 0.5) * 6,
                speedY: -3 - Math.random() * 4,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 15,
                scale: 0.7 + Math.random() * 0.8
            });
        }

        this._lastTime = performance.now();
        this.animate();
    }

    public ngOnDestroy() {
        if (this._animationId) {
            cancelAnimationFrame(this._animationId);
        }
    }

    private animate(currentTime?: number) {
        if (!currentTime) currentTime = performance.now();
        const deltaTime = currentTime - this._lastTime;
        this._lastTime = currentTime;

        this.smiles().forEach(smile => {
            smile.x += smile.speedX * (deltaTime / 16);
            smile.y += smile.speedY * (deltaTime / 16);
            smile.rotation += smile.rotationSpeed * (deltaTime / 16);
        });

        this.smiles.set(
            this.smiles().filter(smile =>
                smile.y > -100 &&
                smile.x > -100 &&
                smile.x < window.innerWidth + 100
            )
        );


        this._animationId = this.smiles().length > 0
            ? requestAnimationFrame(this.animate.bind(this))
            : null;
    }

    private getSmileysForToxicity(percent: number): string[] {
        const matchedLevel = this._toxicityLevels
            .filter((level: any) => percent >= level.minPercent)
            .sort((a: any, b: any) => b.minPercent - a.minPercent)[0];

        return matchedLevel?.emojis || this._toxicityLevels[0].emojis;
    }
}