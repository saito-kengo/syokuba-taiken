import { GraphData, TemperatureData } from "@/constants/type";
import { ReactElement, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import 'react-datepicker/dist/react-datepicker.css';
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { GRAPH_INIT_DATE_INTERVAL } from "@/constants/appParameter";

export type GraphProps = {
    temperatureDatas: TemperatureData[]
};
  
const Graph = (props: GraphProps): ReactElement => {
    const [startDate, setStartDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() - GRAPH_INIT_DATE_INTERVAL)));
    const [endDate, setEndDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() + GRAPH_INIT_DATE_INTERVAL)));
    const [graphDatas, setGraphDatas] = useState<GraphData[]>([]);

    // 初期化時と日付範囲が変更されたときにグラフデータを更新
    useEffect(() => {
        // そのまま絞り込みすると開始日が含まれなくなるため調整
        const startDateAdjusted = new Date(startDate);
        startDateAdjusted.setDate(startDateAdjusted.getDate() - 1);

        const filteredData = props.temperatureDatas
            .filter(data => {
                const dataDate = new Date(data.date);
                return dataDate >= startDate && dataDate <= endDate;
            })
            .map(data => ({
                date: format(new Date(data.date), 'yyyy-MM-dd', { locale: ja }),
                value: parseFloat(data.temperature).toFixed(1)
            }));
        setGraphDatas(filteredData);
    }, [props.temperatureDatas, startDate, endDate]);

    /**
     * 開始日変更処理
     * @param date 選択した日付
     */
    const onChnageStartDate = (date: Date | null) => {
        if (date != null) {
            setStartDate(date);

            // 開始日と終了日が反転しないように調整
            if (endDate < date) {
                setEndDate(date)
            }
        }
    }

    /**
     * 終了日変更処理
     * @param date 選択した日付
     */
    const onChnageEndDate = (date: Date | null) => {
        if (date != null) {
            setEndDate(date)

            // 開始日と終了日が反転しないように調整
            if(startDate > date) {
                setEndDate(date)
            }
        }
    }

    return (
        <div className='mx-8 my-4'>
            <div className="text-3xl my-2">体温変化グラフ</div>
            <div className="w-[17rem] my-4 ml-8 flex border-2 items-center">
            <DatePicker
                selected={startDate}
                onChange={(date) => onChnageStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                dateFormat="yyyy/MM/dd"
                placeholderText="YYYY/MM/DD"
                className="m-1 w-28 text-center"
            />
            <div className="mx-1 text-center">→</div>
            <DatePicker
                selected={endDate}
                onChange={(date) => onChnageEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                dateFormat="yyyy/MM/dd"
                placeholderText="YYYY/MM/DD"
                className="m-1 w-28 text-center"
            />
            </div>
            <div className="flex justify-center" style={{ width: '100%', height: '500px' }}>
                {graphDatas.length > 0 ? (
                    <ResponsiveContainer width="90%" height="100%">
                        <AreaChart data={graphDatas}>
                            <CartesianGrid />
                            <XAxis dataKey="date"/>
                            <YAxis dataKey="value" />
                            <Tooltip formatter={value => `${value}℃`}/>
                            <Legend align="right"/>
                            <Area dataKey="value" fill="rgba(255,190,0,0.3)" stroke="rgb(255, 190, 0)" name="体温変化"/>
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="text-4xl text-center text-gray-500">表示可能なデータがありません</div>
                )}
            </div>
        </div>
    )
}

export default Graph;