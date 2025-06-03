package com.example.springboot.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.springboot.dto.ProductDto;
import com.example.springboot.entity.Product;
import com.example.springboot.repository.ProductRepository;
import java.util.List;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product addProduct(ProductDto dto) {
        Product product = new Product();
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setCategory(dto.getCategory());

        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public void deleteProduct(String name) {
    if (!productRepository.existsByName(name)) {
        throw new IllegalArgumentException("Product with ID " + name + " not found");
    }
    productRepository.deleteByName(name);
}
    public Product patchProduct(Long id, ProductDto dto) {
        Product product = productRepository.findById(id).orElseThrow(() ->
            new IllegalArgumentException("Product with ID " + id + " not found")
        );
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setCategory(dto.getCategory());

        return productRepository.save(product);
    }


    

}
