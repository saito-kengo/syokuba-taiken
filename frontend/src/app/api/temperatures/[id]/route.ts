import { API_SERVER_PATH } from "@/constants/appParameter";
import { NextResponse } from "next/server";

/**
 * 指定IDの体温記録データ取得API呼び出し
 * @param _ リクエストは不要
 * @param param1 指定ID
 * @returns API呼び出し結果（レスポンス）
 */
export const GET = async (_: Request, { params: { id } }: { params: { id: string } }): Promise<Response> => {
   try {
        const res = await fetch(`${API_SERVER_PATH}/temperatures/${id}`, {
            method: 'GET'
        })
        return res; 
    } catch (error: unknown) {
        return new NextResponse(undefined, { status: 500 })
    }
}

/**
 * 体温記録データ更新API呼び出し
 * @param req 更新内容
 * @param param1 指定ID
 * @returns API呼び出し結果（レスポンス）
 */
export const PUT = async (req: Request, { params: { id } }: { params: { id: string } }): Promise<Response> => {
    try {
        const reqData = await req.json();
        console.log(reqData)
        const res = await fetch(`${API_SERVER_PATH}/temperatures/${id}`, {
            method: 'PUT',
            body: JSON.stringify(reqData),
            headers: { 'Content-Type': 'application/json' } 
        })
        return res; 
    } catch (error: unknown) {
        return new NextResponse(undefined, { status: 500 })
    }
}

/**
 * 指定IDの体温記録データ削除API呼び出し
 * @param _ リクエストは不要
 * @param param1 指定ID
 * @returns API呼び出し結果（レスポンス）
 */
export const DELETE = async (_: Request, { params: { id } }: { params: { id: string } }): Promise<Response> => {
    try {
        const res = await fetch(`${API_SERVER_PATH}/temperatures/${id}`, {
            method: 'DELETE'
        })
        return res; 
    } catch (error: unknown) {
        return new NextResponse(undefined, { status: 500 })
    }
}