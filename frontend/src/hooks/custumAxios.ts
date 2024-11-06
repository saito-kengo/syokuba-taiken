import { NEXT_SERVER_PATH } from "@/constants/appParameter";
import axios, { AxiosError, AxiosResponse } from "axios";

// 共通URL（中間API）を設定したaxiosインスタンスを生成
const axiosInstance = axios.create({
    baseURL: `${NEXT_SERVER_PATH}/api`,
    headers: {
        'Content-Type': 'application/json'
    }
})

// レスポンスに対する共通の事前処理
axiosInstance.interceptors.response.use(
    // レスポンスはスルー
    (response: AxiosResponse) => {
        return response
    },
    // エラーはエラー内容毎にログ表示
    (error: AxiosError) => {
        switch (error.response?.status) {
            case 400:
                console.log("データが不正です")
               break;
            case 404:
                console.log("データが見つかりませんでした")
                break;
            case 500:
                console.log("予期せぬエラーが発生しました")
                break;
          default:
            break
        }
        return Promise.reject(error)
       }
)

export default axiosInstance;