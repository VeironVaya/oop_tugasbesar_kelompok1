package com.example.springboot.service;

import org.springframework.stereotype.Service;

import com.example.springboot.dto.ProductDetailDto;
import com.example.springboot.entity.Product;
import com.example.springboot.repository.ProductRepository;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product addProduct(ProductDetailDto dto) {
        Product product = new Product();
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setCategory(dto.getCategory());

        return productRepository.save(product);
    }

    

}
