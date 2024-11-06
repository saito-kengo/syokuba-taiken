import { useIsViewGraphContext } from "@/hooks/isViewGraphProvider";
import { ReactElement } from "react";
import { FaPen } from "react-icons/fa";
import { MdShowChart } from "react-icons/md";

const Header = (): ReactElement => {
    const { toggleState } = useIsViewGraphContext();

    // カレンダー表示クリック
    const onClickShowCalender = (): void => {
        toggleState(false)
    }

    // グラフ表示クリック
    const onClickShowGraph = (): void => {
        toggleState(true)
    }

    return (
        <div className="bg-white p-4 sticky top-0 border-b-2 flex">
            <div className="text-3xl mr-8">体音管理アプリ</div>
            <button
                onClick={() => {onClickShowCalender()}}
                className="p-2 mr-4 w-32 bg-indigo-600 text-white cursor-pointer rounded flex items-center justify-center active:scale-95">
                    <FaPen className="mr-2"/>
                    体温記録
            </button>
            <button
                onClick={() => {onClickShowGraph()}}
                className="p-2 w-32 bg-indigo-600 text-white cursor-pointer rounded flex items-center justify-center active:scale-95">
                    <MdShowChart className="mr-2"/>
                    グラフ
            </button>
        </div>
    )
}

export default Header;