// api/api.ts
// Axios instance and API helper functions for communicating with FakeStoreAPI

import axios, { type AxiosResponse } from 'axios';
import type { Product, Category } from '../types/types';

// Create an Axios instance with the base URL set to FakeStoreAPI
const apiClient = axios.create({
  baseURL: 'https://fakestoreapi.com'
});

// Fetches all products from the API
export const fetchProducts = (): Promise<AxiosResponse<Product[]>> =>
  apiClient.get<Product[]>('/products');

// Fetches all product categories from the API
export const fetchCategories = (): Promise<AxiosResponse<Category[]>> =>
  apiClient.get<Category[]>('/products/categories');
