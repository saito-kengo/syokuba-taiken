import { ACTION_TYPE, ActionType } from "@/constants/type";
import { HEAL_VALUE, SKILL_RATIO } from "@/constants/appParameter";

export class Character {

    private isGuard: boolean = false;
    private isUseSkill: boolean = false;

    constructor(
        private name: string,
        private hp: number,
        private str: number,
        private actionList: ActionType[],
        private imageName: string,
        private isPlayer: boolean
    ) {
    }

    public getInfo(): string {
        return `残りHP：${this.hp}`
    }

    public getName(): string {
        return this.name;
    }

    public getHp(): number {
        return this.hp;
    }

    public getStr(): number {
        return this.str;
    }

    public getActionList(): ActionType[] {
        return this.actionList;
    }

    public getImageName(): string {
        return this.imageName;
    }

    public shiftActionList(): ActionType | undefined {
        const action = this.actionList.shift();
        if(!this.isPlayer && action) {
            this.actionList.push(action)
        }
        return action;
    }
    
    public setNeutral(): void {
        this.isGuard = false;
        this.isUseSkill =false;
    }

    public action(enemy: Character): string {
        this.setNeutral();
        const actionType = this.shiftActionList();
        if(!actionType) {
            return `${this.name}は行動できなかった！`;
        }

        switch(actionType) {
            case ACTION_TYPE.WAIT: 
                return `${this.name}はボーっとしている…`;
            case ACTION_TYPE.ATTACK: 
                let damage = Math.ceil(enemy.isGuard ? this.str / 2 : this.str);
                if (enemy.isUseSkill) {
                    damage = damage * 2;
                }
                this.attack(enemy, damage);
                return `${this.name}は${enemy.name}に攻撃をした！${damage}のダメージを与えた！`
            case ACTION_TYPE.GUARD:
                this.guard();
                return `${this.name}は防御した！次に受けるダメージを半減！`
            case ACTION_TYPE.HEAL:
                this.heal();
                return `${this.name}はヒールを使った！HPを${this.str}回復した！`
            case ACTION_TYPE.SKILL:
                let skillDamage = Math.ceil(enemy.isGuard ? this.str * SKILL_RATIO / 2 : this.str * SKILL_RATIO);
                if (enemy.isUseSkill) {
                    skillDamage = skillDamage * 2;
                }
                this.skill(enemy, skillDamage);
                return `${this.name}の決死の一撃！${skillDamage}のダメージを与えたが、隙だらけになってしまった！`
        }
    }

    public receiveDamage(damage: number) {
        this.hp = Math.max(this.hp - damage, 0);
    }

    public isDead(): boolean {
        return this.hp <= 0;
    }

    public attack(enemy: Character, damage: number): void {
        enemy.receiveDamage(damage);
    }

    public guard(): void {
        this.isGuard = true;
    }

    public heal(): void {
        this.hp += this.str;
    }

    public skill(enemy: Character, damage: number): void {
        enemy.receiveDamage(damage);
        this.isUseSkill = true;
    }

}