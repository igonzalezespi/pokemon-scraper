export class AbilityService {
    public static url = 'https://www.serebii.net/abilitydex/';
    public static selectors = {
        name: 'main table.dextable:nth-of-type(2) > tbody > tr:nth-child(1) > td:nth-child(1) b',
        gameText1: 'tr:contains(Game\'s Text)',
        gameText2: 'td:nth-child(1)',
        effect1: 'tr:contains(In-Depth Effect)',
        effect2: 'td:nth-child(1)'
    };
}