import {InjectionToken} from "@angular/core";
import {BehaviorSubject} from "rxjs";

export const TOXIC_STATE_TOKEN: InjectionToken<BehaviorSubject<'TOXIC' | 'NORMAL' | null>> = new InjectionToken('Состояние классификации');
