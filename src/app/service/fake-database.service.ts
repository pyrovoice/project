import { Injectable } from "@angular/core";
import { Floor } from '../model/floor.model';
import { Section } from '../model/section.model';
import { Product } from '../model/product.model';

@Injectable()
export class FakeDatabase {
    

    floors: Floor[] = [];
    sections: Section[] = [];
    products: Product[] = [];
    public static floorId = 0;
    public static sectionId = 0;
    public static productId = 0;

    constructor(){
        this.initializeData();
    }

    initializeData() {
        for (let i = 0; i < 3; i++) {
            const newFloor = this.createFloor("Floor" + i);
            for (let j = 0; j < 3; j++) {
                const newSection = this.createSection("Section" + FakeDatabase.sectionId, newFloor.id);
                for (let k = 0; k < 3; k++) {
                    this.createProduct("Product" + FakeDatabase.productId, newSection.id);
                }
            }
        }
    }

    createFloor(name: string): Floor {
        let floor = { id: FakeDatabase.floorId++, name: name };
        this.floors.push(floor);
        return floor;
    }

    getFloorById(id) {
        return this.floors.find(f => f.id == id);
    }

    getFloors() {
        return this.floors;
    }

    deleteFloorById(id) {
        let floor = this.floors.find(f => f.id == id);
        if (!floor) {
            return;
        }
        let index = this.floors.indexOf(floor);
        this.floors.splice(index, 1);
    }

    createSection(name: string, parentFloorId: number) {
        let parentFloor = this.getFloorById(parentFloorId);
        if (!parentFloor) {
            return;
        }
        let newSection = { id: FakeDatabase.sectionId++, name: name, parentFloor: parentFloor };
        this.sections.push(newSection);
        return newSection;
    }

    getSectionById(id): Section {
        return this.sections.find(s => s.id == id);
    }

    getSectionByFloorId(floodId) {
        return this.sections.filter(s => s.parentFloor.id == floodId);
    }

    getSections() {
        return this.sections;
    }

    deleteSectionById(id) {
        let section = this.sections.find(s => s.id = id);
        if (!section) {
            return;
        }
        let index = this.sections.indexOf(section);
        this.sections.splice(index, 1);
    }

    createProduct(name: string, parentSectionId: number): Product {
        let parentSection = this.getSectionById(parentSectionId);
        if (!parentSection) {
            return;
        }
        let newProduct = { id: FakeDatabase.productId++, code: name, parentSection: parentSection, quantity: FakeDatabase.productId };
        this.products.push(newProduct);
        return newProduct;
    }

    getProductById(id): Product {
        return this.products.find(p => p.id == id);
    }

    getProductBySectionId(sectionId) {
        return this.products.filter(p => p.parentSection.id == sectionId);
    }

    deleteProductById(id) {
        let product = this.products.find(p => p.id = id);
        if (!product) {
            return;
        }
        let index = this.products.indexOf(product);
        this.products.splice(index, 1);
    }
}