
export type State = 'green' | 'burning' | 'burned';

export type Case = {
    x: number,
    y: number,
    state: State
};

export type RowCases = Case[];

export type Dimension = {
    width: number,
    height: number
}