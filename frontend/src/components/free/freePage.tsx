'use client'
import { ReactElement, useState } from "react";

const FreePageComponent = (): ReactElement => {

    /**
     * テキストのサイズを変えたい場合は以下のrem前の数字を変更
     */
    const textSize = 'text-[4rem]'

    /**
     * テキストの色を変えたい場合は以下のrbg()内の数字を0～255の範囲で変更
     * RGBは https://www.lab-nemoto.jp/www/leaflet_edu/else/ColorMaker.html でチェック
     */    
    const textColer = 'text-[rgb(59,130,246)]'

    /**
     * テキストの内容を変えたい場合は以下の文言を変更
     */
    const textValue = "文字のサイズや色、位置を変えられるよ！"

    /**
     * テキストの上下位置を変更したい場合は以下のrem前の数字を変更
     */
    const textPosV = 'top-[5rem]'

    /**
     * テキストの左右位置を変更したい場合は以下のrem前の数字を変更
     */
    const textPosH = 'left-[1rem]'

    /**
     * テキストを回転させたい場合は以下のdeg前の数字を変更
     */
    const textRotate = 'rotate-[0deg]'

    return (
        <div>
            <div className="w-96 h-16 bg-blue-500 mt-[26rem] ml-[37rem] -rotate-12"></div>
            <div className={'absolute '+textSize+' '+textColer+' '+textPosV+' '+textPosH+' '+textRotate}>{textValue}</div>
        </div>
    )
}

export default FreePageComponent;