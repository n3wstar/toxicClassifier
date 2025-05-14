export interface IPredictResponse {
    text: string;
    prediction: 'TOXIC' | 'NORMAL';
    confidence: number;
}
