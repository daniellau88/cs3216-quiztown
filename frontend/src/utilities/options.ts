export interface OptionsType<V = number | string> {
    value: V;
    label: string;
}

export type Options<V = number | string> = Array<OptionsType<V>>;

export type OptionsMap = {
    [index: number]: Options;
};

export function optionsToNameMap(options: Options): Record<string, string> {
    const mapping: Record<string, string> = {};
    options.forEach((option) => (mapping[option.value] = option.label));
    return Object.freeze(mapping);
}
