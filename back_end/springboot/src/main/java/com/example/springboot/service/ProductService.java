package com.example.springboot.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.springboot.dto.request.ProductWithStockRequestDto;
import com.example.springboot.dto.response.ProductResponseDto;
import com.example.springboot.dto.response.ProductWithStockResponseDto;
import com.example.springboot.dto.response.StockResponseDto;
import com.example.springboot.entity.Product;
import com.example.springboot.entity.Stock;
import com.example.springboot.exception.InvalidDataException;
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

    public ProductWithStockResponseDto postProductWithStockResponseDto(ProductWithStockRequestDto dto) {
   
    if (dto.getName() == null || dto.getName().trim().isEmpty()) {
        throw new InvalidDataException("Name is required");
    }
    if (dto.getPrice() < 0) {
        throw new InvalidDataException("Price must be non-negative");
    }
     if (dto.getSize() == null || dto.getSize().trim().isEmpty()) {
        throw new InvalidDataException("Size is required");
    }
    if (dto.getStockQuantity() < 0) {
        throw new InvalidDataException("Stock quantity must be non-negative");
    }

    Product p = new Product();
    p.setName(dto.getName());
    p.setDescription(dto.getDescription());
    p.setPrice(dto.getPrice());
    p.setCategory(dto.getCategory());
    
    Product saved = productRepository.save(p);

    
    Stock s = new Stock();
    s.setProduct(saved);
    s.setSize(dto.getSize());
    s.setStock_quantity(dto.getStockQuantity());
    Stock savedStock = stockRepository.save(s);

    
    ProductWithStockResponseDto resp = new ProductWithStockResponseDto();
    resp.setIdProduct(saved.getIdProduct());
    resp.setName(saved.getName());
    resp.setDescription(saved.getDescription());
    resp.setPrice(saved.getPrice());
    resp.setCategory(saved.getCategory());
    

    StockResponseDto stockDto = new StockResponseDto();
    stockDto.setIdStock(savedStock.getId_stock());
    stockDto.setSize(savedStock.getSize());
    stockDto.setStockQuantity(savedStock.getStock_quantity());
    resp.setStocks(List.of(stockDto));

    return resp;
    }


    public List<ProductResponseDto> getAllProducts() {
    return productRepository.findAll().stream()
      .map(this::toDto)
      .collect(Collectors.toList());

    
    }
    public List<ProductResponseDto> getProductsByCategory(String category) {
        return productRepository.findByCategoryIgnoreCase(category).stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    private ProductResponseDto toDto(Product p) {
        ProductResponseDto dto = new ProductResponseDto();
        dto.setIdProduct(p.getIdProduct());
        dto.setName(p.getName());
        dto.setDescription(p.getDescription());
        dto.setPrice(p.getPrice());
        dto.setCategory(p.getCategory());
        return dto;
    }


   


    public void deleteProduct(Long Id) {
    if (!productRepository.existsById(Id)) {
        throw new IllegalArgumentException("Product with ID " + Id + " not found");
    }
    productRepository.deleteById(Id);
}
    public Product patchProduct(Long id, ProductWithStockRequestDto dto) {
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
