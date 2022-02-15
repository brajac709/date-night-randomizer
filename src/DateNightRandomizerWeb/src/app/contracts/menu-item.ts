export interface MenuItem {
    label : string;
    value : string;
    click : ((item : MenuItem) => void) | undefined;
}