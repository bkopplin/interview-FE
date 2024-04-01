export interface DwellingStatsResponse {
    version:   string;
    class:     string;
    label:     string;
    source:    string;
    updated:   Date;
    note:      string[];
    role:      Role;
    id:        string[];
    size:      number[];
    dimension: Dimension;
    extension: DwellingStatsResponseExtension;
    value:     number[];
}

export interface Dimension {
    Boligtype:    Boligtype;
    ContentsCode: ContentsCode;
    Tid:          Tid;
}

export interface Boligtype {
    label:     string;
    category:  BoligtypeCategory;
    extension: BoligtypeExtension;
    link:      Link;
}

export interface BoligtypeCategory {
    index: {[key: string]: string};
    label: {[key: string]: string};
}

export interface BoligtypeExtension {
    elimination: boolean;
    show:        string;
}

export interface Link {
    describedby: Describedby[];
}

export interface Describedby {
    extension: DescribedbyExtension;
}

export interface DescribedbyExtension {
    Boligtype: string;
}

export interface ContentsCode {
    label:     string;
    category:  ContentsCodeCategory;
    extension: ContentsCodeExtension;
}

export interface ContentsCodeCategory {
    index: FluffyIndex;
    label: RefperiodClass;
    unit:  Unit;
}

export interface FluffyIndex {
    KvPris: number;
}

export interface RefperiodClass {
    KvPris: string;
}

export interface Unit {
    KvPris: KvPris;
}

export interface KvPris {
    base:     string;
    decimals: number;
}

export interface ContentsCodeExtension {
    elimination: boolean;
    refperiod:   RefperiodClass;
    show:        string;
}

export interface Tid {
    label:     string;
    category:  TidCategory;
    extension: BoligtypeExtension;
}

export interface TidCategory {
    index: number;
    label: {[key: string]: string};
}


export interface DwellingStatsResponseExtension {
    px:      Px;
    contact: Contact[];
}

export interface Contact {
    name:  string;
    phone: string;
    mail:  string;
    raw:   string;
}

export interface Px {
    infofile:              string;
    tableid:               string;
    decimals:              number;
    "official-statistics": boolean;
    aggregallowed:         boolean;
    language:              string;
    matrix:                string;
    "subject-code":        string;
}

export interface Role {
    time:   string[];
    metric: string[];
}
