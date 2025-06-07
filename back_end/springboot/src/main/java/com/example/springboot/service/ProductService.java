package com.example.springboot.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.springboot.dto.request.ProductDto;
import com.example.springboot.dto.response.ProductResponseDto;
import com.example.springboot.dto.response.StockResponseDto;
import com.example.springboot.entity.Product;
import com.example.springboot.entity.Stock;
import com.example.springboot.repository.ProductRepository;
import com.example.springboot.repository.StockRepository;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final StockRepository stockRepository;

    public ProductService(ProductRepository productRepository,
                          StockRepository stockRepository) {
        this.productRepository = productRepository;
        this.stockRepository = stockRepository;
    }

    public ProductResponseDto addProduct(ProductDto dto) {
    // 1) Save Product entity
    Product p = new Product();
    p.setName(dto.getName());
    p.setDescription(dto.getDescription());
    p.setPrice(dto.getPrice());
    p.setCategory(dto.getCategory());
    // … etc …
    Product saved = productRepository.save(p);

    // 2) Save one Stock entity
    Stock s = new Stock();
    s.setProduct(saved);
    s.setSize(dto.getSize());
    s.setStock_quantity(dto.getStockQuantity());
    Stock savedStock = stockRepository.save(s);

    // 3) Map saved → response DTO
    ProductResponseDto resp = new ProductResponseDto();
    resp.setIdProduct(saved.getId_product());
    resp.setName(saved.getName());
    resp.setDescription(saved.getDescription());
    resp.setPrice(saved.getPrice());
    resp.setCategory(saved.getCategory());
    // resp.setImageUrl(saved.getImageUrl());   // if applicable

    StockResponseDto stockDto = new StockResponseDto();
    stockDto.setIdStock(savedStock.getId_stock());
    stockDto.setSize(savedStock.getSize());
    stockDto.setStockQuantity(savedStock.getStock_quantity());
    resp.setStocks(List.of(stockDto));

    return resp;
}


    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategoryIgnoreCase(category);
    }


    public void deleteProduct(Long Id) {
    if (!productRepository.existsById(Id)) {
        throw new IllegalArgumentException("Product with ID " + Id + " not found");
    }
    productRepository.deleteById(Id);
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

    public Product getProductDetail(Long id) {
        return productRepository.findById(id).orElseThrow(() -> 
        new IllegalArgumentException("Product with ID " + id + " not found"));
    }

    public List<Product> getProductsByKeyword(String keyword) {
        return productRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword);
    }

}
