/**
 * 体温データの型
 */
export type TemperatureData = {
    id: number,
    date: Date,
    temperature: string
}

/**
 * グラフ用データの型
 */
export type GraphData = {
    date: string,
    value: string 
}