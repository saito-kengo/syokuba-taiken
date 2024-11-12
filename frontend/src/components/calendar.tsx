"use client"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { Draggable, DropArg } from '@fullcalendar/interaction'
import { ReactElement, useEffect, useState } from 'react'
import RegisterDialog from './registerDialog'
import { TemperatureData } from '@/constants/type'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import UpdateDialog from './updateDialog'
import axiosInstance from '@/hooks/custumAxios'
import { useRouter } from 'next/navigation'
import { DELETE_FAIL_MESSAGE, DELETE_SUCCESS_MESSAGE, REGISTER_FAIL_MESSAGE, REGISTER_SUCCESS_MESSAGE, UPDATE_FAIL_MESSAGE, UPDATE_SUCCESS_MESSAGE } from '@/constants/message'

export type CalenderProps = {
    temperatureDatas: TemperatureData[],
    onFetch: () => void;
};

/**
 * カレンダーコンポーネント
 * @param props 親から渡される各種データ（全体温データ、データフェッチコールバック）
 */
const Calender = (props: CalenderProps): ReactElement => {
    const router = useRouter();
    
    const [temperatures, setTemperatures] = useState<TemperatureData[]>(props.temperatureDatas);
    const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState<boolean>(false);
    const [selectDate, setSelectDate] = useState<Date>(new Date());
    const [selectTemp, setSelectTemp] = useState<TemperatureData>({id: 0, temperature: "0", date: new Date()});

    /**
     * 体温データ更新時に最新の全データを取得
     */
    useEffect(() => {
        setTemperatures(props.temperatureDatas)
    }, [props.temperatureDatas])

    /**
     * 日付欄クリック時の処理
     * @param date クリックした日付
     */
    const onClickDate = (date: Date): void => {
        // クリックした日に体温記録があるかチェック
        const tempData = temperatures.find(data => format(new Date(data.date), 'yyyy-MM-dd', { locale: ja }) == format(new Date(date), 'yyyy-MM-dd', { locale: ja }));
        setSelectDate(date);

        // 体温データがあれば更新、無ければ登録ダイアログを表示
        if(tempData) {
            setSelectTemp( {id: Number(tempData.id), temperature: tempData.temperature, date: date} )
            handleUpdateEvent({ id: tempData.id, temperature: tempData.temperature, date: tempData.date })
        } else {
            setIsRegisterOpen(true);
        }
    }

    /**
     * 体温データ更新イベントハンドラ
     * @param data 対象体温データ
     */
    const handleUpdateEvent = (data: TemperatureData): void  => {
        // 選択した日付と体温データを保持して更新ダイアログ表示
        setSelectDate(data.date);
        setSelectTemp(data)
        setIsUpdateOpen(true);
    }

    /**
     * 体温データ登録処理ハンドラ
     * @param data 登録する体温データ
     */
    const handleRegister = async (data: TemperatureData): Promise<void>  => {
        // 体温データ登録API呼び出し（成功時はダイアログを閉じる）
        await axiosInstance.post('/temperatures', {
            id: data.id,
            date: convertDateToUtc(data.date),
            temperature: data.temperature
          })
          .then(_ => {
            alert(REGISTER_SUCCESS_MESSAGE)
            setIsRegisterOpen(false)
            props.onFetch();
            router.refresh();
          })
          .catch(error => {
            console.log(error);
            alert(REGISTER_FAIL_MESSAGE);
          })  
    }

    /**
     * 体温データ差k所処理ハンドラ
     * @param data 削除する体温データ
     */
    const handleDelete = async (data: TemperatureData): Promise<void>  => {
        // 体温データ削除API呼び出し（成功時はダイアログを閉じる）
        await axiosInstance.delete(`/temperatures/${data.id}`)
        .then(_ => {
          alert(DELETE_SUCCESS_MESSAGE)
          setIsUpdateOpen(false)
          props.onFetch();
          router.refresh();
        })
        .catch(error => {
          console.log(error);
          alert(DELETE_FAIL_MESSAGE);
        })   
    }

    /**
     * 体温データ更新処理ハンドラ
     * @param data 更新する体温データ
     */
    const handleUpdate = async (data: TemperatureData): Promise<void> => {
        // 体温データ更新API呼び出し（成功時はダイアログを閉じる）
        await axiosInstance.put(`/temperatures/${data.id}`, {
          id: data.id,
          date: convertDateToUtc(data.date),
          temperature: data.temperature
        })
        .then(_ => {
          alert(UPDATE_SUCCESS_MESSAGE)
          setIsUpdateOpen(false)
          props.onFetch();
          router.refresh();
        })
        .catch(error => {
          console.log(error);
          alert(UPDATE_FAIL_MESSAGE);
        }) 
    }

    /**
     * 日付をUTCに変換
     * @param date 変換する日付
     * @returns UTC変換後の日付
     */
    const convertDateToUtc = (date: Date): Date => {
        const baseDate = new Date(date); 
        return new Date(Date.UTC(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate()));
    }

    return (
        <div className='mx-8 my-4'>
            <RegisterDialog
                open={isRegisterOpen}
                date={selectDate}
                onCancel={() => setIsRegisterOpen(false)}
                onRegister={handleRegister}
            />
            <UpdateDialog
                open={isUpdateOpen}
                data={selectTemp}
                onCancel={(() => setIsUpdateOpen(false))}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
            />
                <FullCalendar
                locale={'ja'}
                timeZone={'local'}
                titleFormat={{year: 'numeric', month: 'short', day: '2-digit'}}
                events={temperatures.map((data) => ({
                    id: String(data.id),
                    title: data.temperature,
                    start: format(new Date(data.date), 'yyyy-MM-dd', { locale: ja })
                }))}
                plugins={[
                    dayGridPlugin,
                    interactionPlugin
                ]}
                dateClick={(target) => {onClickDate(target.date)}}
                eventClick={(target) => {handleUpdateEvent({ id: Number(target.event.id) , temperature: target.event.title, date: new Date(target.event.startStr) })}}
                headerToolbar={{
                    left: 'prev next today',
                    center: 'title',
                    right: ''
                }}
                height={600}
                />
        </div>
    );
}

export default Calender;