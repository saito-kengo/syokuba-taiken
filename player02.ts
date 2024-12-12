import { ACTION_TYPE, ActionType } from "@/constants/type";

export const P2_ACTION_LIST: ActionType[] = [ACTION_TYPE.SKILL,ACTION_TYPE.HEAL,ACTION_TYPE.HEAL,ACTION_TYPE.GUARD]

export const PLAYER02 = {
    name: "じゅなてぇてぇ",
    hp: 50,
    mp: 10,
    str: 100,
    def: 40,
    speed: 200,
    actions: P2_ACTION_LIST,
    image: "フリーナ.jpg"
}
