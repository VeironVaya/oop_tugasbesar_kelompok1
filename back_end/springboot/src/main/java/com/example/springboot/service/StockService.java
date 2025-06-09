package com.example.springboot.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.springboot.dto.request.StockRequestDto;
import com.example.springboot.dto.response.StockResponseDto;
import com.example.springboot.entity.Product;
import com.example.springboot.entity.Stock;
import com.example.springboot.exception.InvalidDataException;
import com.example.springboot.repository.ProductRepository;
import com.example.springboot.repository.StockRepository;

@Service
@Transactional
public class StockService {

    private final StockRepository stockRepository;
    private final ProductRepository productRepository;

    public StockService(
            StockRepository stockRepository,
            ProductRepository productRepository) {
        this.stockRepository = stockRepository;
        this.productRepository = productRepository;
    }

    public StockResponseDto postStockToProduct(Long productId, StockRequestDto dto) {

        if (dto.getSize() == null || dto.getSize().trim().isEmpty()) {
            throw new InvalidDataException("Size is required");
        }
        if (dto.getStockQuantity() < 0) {
            throw new InvalidDataException("Stock must be non-negative");
        }

        stockRepository.findByProduct_IdProductAndSize(productId, dto.getSize())
                .ifPresent(existing -> {
                    throw new InvalidDataException("Size “" + dto.getSize() + "” already exists for this product");
                });

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Product not found with id: " + productId));

        Stock stock = new Stock();
        stock.setProduct(product);
        stock.setSize(dto.getSize());
        stock.setStock_quantity(dto.getStockQuantity());
        Stock saved = stockRepository.save(stock);

        StockResponseDto response = new StockResponseDto();
        response.setIdStock(saved.getId_stock());
        response.setSize(saved.getSize());
        response.setStockQuantity(saved.getStock_quantity());
        return response;
    }
}
