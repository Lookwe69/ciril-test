import { ReactiveController, ReactiveControllerHost } from "lit";
import type {State, Dimension, RowCases, Case} from './../types/types';
const data = await fetch('./data/data.json').then(response => response.json());


export class SimulationController implements ReactiveController {

    #host: ReactiveControllerHost;

    get dimension(): Dimension {
        return data.dimension;
    }

    #casesMatrice!: RowCases[];
    get casesMatrice(): RowCases[] {
        return this.#casesMatrice;
    }
    set casesMatrice(value: RowCases[]) {
        this.#casesMatrice = value;
        this.#host.requestUpdate();
    }

    #step = 0;
    get step(): number {
        return this.#step;
    }
    set step(value: number) {
        this.#step = value;
        this.#host.requestUpdate();
    }

    #timeout: number;

    constructor(
        host: ReactiveControllerHost,
        timeout: number
    ) {
        (this.#host = host).addController(this);
        this.#timeout = timeout;
        this.#initCases();
    }

    restart() {
        this.stopInterval();
        this.step = 0;
        this.#initCases();
        this.startInterval();
    }

    #initCases() {
        const casesMatrice: RowCases[] = [];
        const {width, height} = this.dimension;
        
        for (let x = 0; x < width; x++) {
            const rowCases: RowCases = [];
            for (let y = 0; y < height; y++) {
                rowCases.push({
                    x,
                    y,
                    state: this.#initStateCase(x, y),
                });
            }
            casesMatrice.push(rowCases);
        }
        this.casesMatrice = casesMatrice;
    }

    #initStateCase(x: number, y: number): State {
        return data.startCases.some(([xStart, yStart]: [number, number]) => x === xStart && y === yStart)
            ? 'burning'
            : 'green';
    }


    getCaseToBurn(x: number, y: number): Case | undefined {
        const caseObj = this.casesMatrice[x]?.[y];
        
        if (caseObj?.state !== 'green') return;
        if ((data.probability - Math.random()) < 0) return;
        return caseObj;
    }

    forwardStep() {
        const burningCases = this.casesMatrice.flat().filter(caseObj => caseObj.state === 'burning');
        if (burningCases.length > 0) {
            for (const caseObj of burningCases) {
                caseObj.state = 'burned';

                const promixityCases = [
                    this.getCaseToBurn(caseObj.x, caseObj.y - 1),
                    this.getCaseToBurn(caseObj.x + 1, caseObj.y),
                    this.getCaseToBurn(caseObj.x, caseObj.y + 1),
                    this.getCaseToBurn(caseObj.x - 1, caseObj.y),
                ].filter(caseObj => caseObj !== undefined) as Case[];

                for (const promixityCase of promixityCases) {
                    promixityCase.state = 'burning';
                }
            }
            
            this.step++;
        } else {
            this.stopInterval();
        }
    }

    #interval?: number;
    startInterval() {
        this.#interval = setInterval(() => {
            this.forwardStep();
        }, this.#timeout);
    }

    stopInterval() {
        clearInterval(this.#interval);
    }

    hostConnected(): void {
        this.startInterval();
    }

    hostDisconnected(): void {
        this.stopInterval();
    }
}