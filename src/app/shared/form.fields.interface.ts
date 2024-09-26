import { GeneralFields } from "./services/general.fields.interface";

export interface FormFields {
    title: string;
    button: string;
    fields: GeneralFields[];
}