import axios from 'axios';

class ProductApi {

  async getProducts(request) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/products/`, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );

    const products = response.data;
    return products
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async getProduct(id) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/products/${id}`, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const product = response.data;
    console.log(product )
    return product
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async updateProduct(id, productData) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/products/${id}`, 
      productData, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const product = response.data;
    return product
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async createProduct(productData) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/products/`, 
      productData, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const product = response.data;
    return product
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async deleteProduct(id) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/products/${id}`, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const product = response.data;
    return product
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }

  /*  STOCK PRODUCTS */
  async getProductsStock(request) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/productstock/`, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );

    const productstock = response.data;
    return productstock
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async getProductStock(id) { // ver stocks de un p´roduct
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/productstock/${id}`, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const stock = response.data;
    return stock
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async updateProductStock(id, productData) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/productsstock/${id}`, 
      productData, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const product = response.data;
    return product
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async createProductStock(productData) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/productstock/`, 
      productData, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const product = response.data;
    return product
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async deleteProductStock(id) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/productsstock/${id}`, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const product = response.data;
    return product
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async getProductSales(id) { 
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/productsales/${id}`, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const sales = response.data;
    return sales
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
}

export const productApi = new ProductApi();