export class ItemService {
    public static url = 'https://www.serebii.net/itemdex/';
    //"Hold Item", "Stat Items", "Berries"
    public static selectors = {
        name: 'main table.dextable:nth-of-type(1) > tbody > tr:nth-child(1) > td:nth-child(2) b',
        description: 'table.dextable:contains(Flavour Text) > tbody > tr:contains(Sword):contains(Shield) > td:last-child',
        effect: 'table.dextable:contains(In-Depth Effect) > tbody > tr:nth-child(2) > td:last-child',
        validLocation: 'table.dextable:contains(Locations):contains(Sword):contains(Shield)',
        validShopping: 'table.dextable:contains(Shopping Details):contains(Sword):contains(Shield)'
    };
}