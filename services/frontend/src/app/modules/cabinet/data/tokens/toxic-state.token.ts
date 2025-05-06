import { InjectionToken } from "@angular/core";
import { Subject } from "rxjs";

export const TOXIC_STATE_TOKEN: InjectionToken<Subject<number>> = new InjectionToken('Состояние классификации');