import { AdvancedMap } from '../../../../core';
import { IFigureDataPalette } from '../../interfaces';
import { IPalette } from './IPalette';
import { IPartColor } from './IPartColor';
import { PartColor } from './PartColor';

export class Palette implements IPalette
{
    // pixelrp: custom colors. A color id from 0x1000000 to 0x1FFFFFF is in no
    // palette - it carries its own RGB (id - 0x1000000), the color a player
    // picked in Change Your Outfit. The client's renderer reads them the same
    // way (@nitrots-nitro-renderer-patch-custom-colors.patch).
    public static CUSTOM_COLOR_BASE: number = 0x1000000;
    public static CUSTOM_COLOR_MAX: number = 0x1FFFFFF;
    private static _customColors: Map<number, IPartColor> = new Map();

    private _id: number;
    private _colors: AdvancedMap<string, IPartColor>;

    constructor(data: IFigureDataPalette)
    {
        if(!data) throw new Error('invalid_data');

        this._id = data.id;
        this._colors = new AdvancedMap();

        this.append(data);
    }

    public append(data: IFigureDataPalette): void
    {
        for(const color of data.colors)
        {
            const newColor = new PartColor(color);

            this._colors.add(color.id.toString(), newColor);
        }
    }

    public getColor(id: number): IPartColor
    {
        if((id === undefined) || id < 0) return null;

        if((id >= Palette.CUSTOM_COLOR_BASE) && (id <= Palette.CUSTOM_COLOR_MAX)) return Palette.getCustomColor(id);

        return (this._colors.getValue(id.toString()) || null);
    }

    private static getCustomColor(id: number): IPartColor
    {
        let color = Palette._customColors.get(id);

        if(!color)
        {
            const hexCode = (id - Palette.CUSTOM_COLOR_BASE).toString(16).padStart(6, '0');

            color = new PartColor({ id, index: -1, club: 0, selectable: false, hexCode });

            Palette._customColors.set(id, color);
        }

        return color;
    }

    public get id(): number
    {
        return this._id;
    }

    public get colors(): AdvancedMap<string, IPartColor>
    {
        return this._colors;
    }
}
