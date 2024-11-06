import { API_SERVER_PATH } from "@/constants/appParameter";
import { NextResponse } from "next/server";

/**
 * 全体温記録データ取得API呼び出し
 * @returns API呼び出し結果（レスポンス）
 */
export const GET = async (): Promise<Response> => {
    try {
        const res = await fetch(`${API_SERVER_PATH}/temperatures`, {
            method: 'GET'
        })
        return res; 
    } catch (error: unknown) {
        return new NextResponse(undefined, { status: 500 })
    }
}

/**
 * 体温データ作成API呼び出し
 * @param req 作成する体温データ（リクエスト）
 * @returns API呼び出し結果（レスポンス）
 */
export const POST = async (req: Request): Promise<Response> => {
    try {
        const reqData = await req.json();
        const res = await fetch(`${API_SERVER_PATH}/temperatures`, {
            method: 'POST',
            body: JSON.stringify(reqData),
            headers: { 'Content-Type': 'application/json' } 
        })
        return res;
    } catch (error: unknown) {
        return new NextResponse(undefined, { status: 500 })
    }
}