package com.example.springboot.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.springboot.dto.request.ProductRequestDto;
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
        stockDto.setIdStock(savedStock.getIdStock());
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

    public ProductWithStockResponseDto patchProductWithStock(Long id, ProductRequestDto dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product with ID " + id + " not found"));

        List<Stock> stocks = stockRepository.findAllByProduct_IdProduct(id);
        ProductWithStockResponseDto resp = new ProductWithStockResponseDto();

        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setCategory(dto.getCategory());
        productRepository.save(product);

        resp.setName(product.getName());
        resp.setDescription(product.getDescription());
        resp.setPrice(product.getPrice());
        resp.setCategory(product.getCategory());
        List<StockResponseDto> stockDtos = stocks.stream()
                .map(stock -> {
                    StockResponseDto sd = new StockResponseDto();
                    sd.setStatus(true);
                    sd.setMessage("OK");
                    sd.setIdStock(stock.getIdStock());
                    sd.setSize(stock.getSize());
                    sd.setStockQuantity(stock.getStock_quantity());
                    return sd;
                })
                .collect(Collectors.toList());

        resp.setStocks(stockDtos);

        return resp;

    }

    public ProductWithStockResponseDto getProductWithStockResponseDto(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product with ID " + id + " not found"));

        List<Stock> stocks = stockRepository.findAllByProduct_IdProduct(id);
        ProductWithStockResponseDto resp = new ProductWithStockResponseDto();
        resp.setIdProduct(id);
        resp.setStatus(true);
        resp.setMessage("product retrieve successfully");
        resp.setName(product.getName());
        resp.setDescription(product.getDescription());
        resp.setCategory(product.getCategory());
        resp.setPrice(product.getPrice());

        List<StockResponseDto> stockDtos = stocks.stream()
                .map(stock -> {
                    StockResponseDto dto = new StockResponseDto();
                    // if you really need per‐item status/message:
                    dto.setStatus(true);
                    dto.setMessage("OK");
                    // map your actual stock properties:
                    dto.setIdStock(stock.getIdStock());
                    dto.setSize(stock.getSize());
                    dto.setStockQuantity(stock.getStock_quantity());
                    return dto;
                })
                .collect(Collectors.toList());
        resp.setStocks(stockDtos);
        return resp;
    }

    public List<Product> getProductsByKeyword(String keyword) {
        return productRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword);
    }

}
