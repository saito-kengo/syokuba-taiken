import FreePageComponent from "@/components/free/freePage"

const FreePage  = (): JSX.Element => {
    return (
        <div className="m-4">
            <div className="p-2 border-b-2">
                <div className="text-4xl">チャレンジページ：ソースコードで文字を操作して青四角の中に移動してみよう</div>
            </div>
            <FreePageComponent/>
        </div>
    )
}

export default FreePage;