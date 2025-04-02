export interface Package {
    id: number;
    name: string;
    description: string | null;
    short_description: string | null;
    base_price: number;
    total_price: number;
    discount: number;
    sales_tax: number;
    currency: string;
    sort_order: number;
    image: string;
    type: string;
    expiration_date: string | null;
    created_at: string | null;
    updated_at: string;
    category_id: number;
}