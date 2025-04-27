import ReviewModel from "./ReviewModel";

export default interface ProductModel {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  reviews: ReviewModel[];
}

