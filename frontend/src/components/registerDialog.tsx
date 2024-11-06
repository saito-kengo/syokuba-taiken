import React, { ReactElement, useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { TemperatureData } from '@/constants/type';

export type RegisterDialogProps = {
  open: boolean;
  date: Date;
  onCancel: () => void;
  onRegister: (temperature: TemperatureData) => void;
};

const RegisterDialog = (props: RegisterDialogProps): ReactElement | null => {
    const [temperature, setTemperature] = useState<string>("");

    /**
     * キャンセル処理
     */
    const handleCancel = (): void => {
        setTemperature("");
        props.onCancel();
    }

    /**
     * 保存処理
     */
    const handleSave = async (): Promise<void> => {
      props.onRegister({ id: 0, temperature: temperature, date: props.date })
    }

    /**
     * 値変更時のハンドラ
     * @param value 変更された値
     */
    const handleChange = (value: string): void => {
      // 入力された値を数値に変換し、1桁の小数で表示
      if (value !== "") {
        setTemperature(parseFloat(value).toFixed(1));
      } else {
        setTemperature("");
      }
    }

    return props.open ? (
      <>
        <div className="min-w-max min-h-max fixed bg-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/5 h-2/5 p-8 flex flex-col items-start z-20 overflow-auto">
          <div className='border-b-2 w-full'>
           <h1 className="text-xl font-bold mb-4">体温を入力</h1>
          </div>
            <div className='my-4'>
            <label className="font-sans font-bold text-1xl text-black">
                {`${format(new Date(props.date), 'yyyy/M/d', { locale: ja })}の体温`}
                <input
                  type="number"
                  step="0.1"
                  className="w-[90%] h-[2rem] mx-auto text-black border border-slate-500"
                  value={temperature}
                  onChange={(event) => handleChange(event.target.value)}></input>
                </label>
            </div>
            <div className="flex mt-auto w-full justify-center space-x-16">
            <button
                className="w-36 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                onClick={handleCancel}
            >
            キャンセル
            </button>
            <button
                className={`${
                    temperature ? "bg-blue-500 hover:bg-blue-700 border-blue-700 rounded" : " border-gray-500 bg-slate-400"
                } w-36 font-bold py-2 px-4 border text-white`}
                onClick={handleSave}
                disabled={!temperature}
            >
            保存
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

export default RegisterDialog;
