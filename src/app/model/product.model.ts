import { Section } from './section.model';

export declare class Product{
    id: number;
    code: string;
    parentSection: Section;
    quantity: number;
}