export interface MenuItem {
    label : string;
    value : string;
    route? : string;
    click? : ((item : MenuItem) => void);
}