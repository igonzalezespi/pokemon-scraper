interface Attack {
    name: string;
    type: string;
    category: string;
    powerPoints: number;
    basePower: number;
    accuracy: number;
    battleEffect: string;
    secondaryEffect: string;
    effectRate: number;
    maxMove: string;
    maxMovePower: number;
    critRate: number;
    priority: number;
    target: string;
    contact: boolean;
    sound: boolean;
    punch: boolean;
    snatchable: boolean;
    gravity: boolean;
    defrost: boolean;
    reflect: boolean;
    block: boolean;
    copy: boolean;
    pokemon: string[];
}
