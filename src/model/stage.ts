

export class BattleStage {
    
    constructor(private name: string, private imageName: string) {}

    public getStageName(): string {
        return this.name;
    }

    public getImageName(): string {
        return this.imageName
    }
}