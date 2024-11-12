import React, { ReactElement, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { TemperatureData } from '@/constants/type';

export type UpdateDialogProps = {
  open: boolean;
  data: TemperatureData;
  onCancel: () => void;
  onDelete: (temperature: TemperatureData) => void;
  onUpdate: (temperature: TemperatureData) => void;
};

/**
 * 体温編集ダイアログコンポーネント
 * @param props 親から渡される各種データ（開閉フラグ、日付、キャンセルコールバック、削除コールバック、更新コールバック）
 */
const UpdateDialog = (props: UpdateDialogProps): ReactElement | null => {
    const [temperature, setTemperature] = useState<TemperatureData>(props.data);

    // 親で選択（＝変更）を検知したら持っている値を更新
    useEffect(() => {
      setTemperature(props.data);
    }, [props.data]);

    // キャンセル処理
    const handleCancel = (): void => {
      setTemperature(props.data)
      props.onCancel();
    }

    // 削除処理
    const handleDelete = (): void => {
      props.onDelete(temperature);
    }

    // 更新処理
    const onClickUpdate = (): void => {
      props.onUpdate(temperature);
    }

    /**
     * 値変更時のハンドラ
     * @param value 変更された値
     */
    const handleChange = (value: string): void => {
      // 入力された値を数値に変換し、1桁の小数で表示
      if (value !== "") {
        const floatValue = Math.max(parseFloat(value), 0.0);
        setTemperature({ id: temperature.id, temperature: floatValue.toFixed(1), date: temperature.date });
      } else {
        setTemperature({ id: temperature.id, temperature: "", date: temperature.date });
      }
    }

    return props.open ? (
      <>
        <div className="min-w-max min-h-max fixed bg-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/5 h-2/5 p-8 flex flex-col items-start z-20 overflow-auto">
          <div className='border-b-2 w-full'>
            <h1 className="text-xl font-bold mb-4">体温を変更</h1>
          </div>
            <div className='my-4'>
            <label className="font-sans font-bold text-1xl text-black block mb-2">
              {`${format(new Date(temperature.date), 'yyyy/M/d', { locale: ja })}の体温`}
            <input
              type="number"
              step="0.1"
              id="temp"
              className="w-[70%] text-black border border-slate-500 block"
              onChange={(event) => handleChange(event.target.value)}
              value={temperature.temperature}></input>
                </label>
            </div>
            <div className="flex mt-auto w-full justify-center space-x-16">
            <button
                className="w-36 bg-red-700 hover:bg-red-600 text-whit py-2 px-4 font-bold text-white rounded"
                onClick={handleDelete}
            >
            削除
            </button>
            <button
                className={`${
                    temperature ? "bg-blue-500 hover:bg-blue-700 border-blue-700 rounded" : " border-gray-500 bg-slate-400"
                } w-36 font-bold py-2 px-4 border text-white`}
                onClick={onClickUpdate}
                disabled={!temperature}
            >
            変更
            </button>
          </div>
        </div>
        <div
          className="fixed top-0 left-0 bg-black bg-opacity-50 w-full h-full z-10"
          onClick={handleCancel}
        ></div>
      </>
    ) : null;
  };

export default UpdateDialog;
