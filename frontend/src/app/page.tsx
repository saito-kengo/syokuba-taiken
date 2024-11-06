'use client'

import Calender from "@/components/calendar";
import Graph from "@/components/graph";
import Header from "@/components/header";
import { TemperatureData } from "@/constants/type";
import axiosInstance from "@/hooks/custumAxios";
import { useIsViewGraphContext } from "@/hooks/isViewGraphProvider";
import { useEffect, useState } from "react";

export default function Home() {
  // コンテキストでグラフ表示中か管理
  const { isViewGraph } = useIsViewGraphContext();

  const [ temperatures, setTemperatures] = useState<TemperatureData[]>([]);

  /**
   * 最新の全体温データ取得API呼び出し
   */
  const fetchAllDatas = async (): Promise<void> => {
      await axiosInstance.get('/temperatures')
      .then(res => {
          setTemperatures(res.data)
      })
      .catch(error => {
          alert("データの取得に失敗しました")
      })
  }

  const fetchBetweenData = async (from: Date): Promise<void> => {

  }

  // 初回マウント時にフェッチ実行
  useEffect(() => {
      fetchAllDatas();
  }, [])

  return (
      <>
          <Header/>
          {/* フラグに応じてカレンダーとグラフを切り替え */}
          {isViewGraph ? <Graph temperatureDatas={temperatures}/>
              :
          <Calender temperatureDatas={temperatures} onFetch={fetchAllDatas}/>
      }
      </>
  )  
}
