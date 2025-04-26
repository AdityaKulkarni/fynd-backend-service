import ReviewModel from "./ReviewModel";

interface ProductModel {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  reviews: ReviewModel[];
}

