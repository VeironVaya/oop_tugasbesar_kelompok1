package com.example.springboot.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.springboot.dto.request.StockDto;
import com.example.springboot.dto.response.StockResponseDto;
import com.example.springboot.entity.Product;
import com.example.springboot.entity.Stock;
import com.example.springboot.repository.ProductRepository;
import com.example.springboot.repository.StockRepository;

@Service
@Transactional
public class StockService {

    private final StockRepository stockRepository;
    private final ProductRepository productRepository;

    public StockService(
            StockRepository stockRepository,
            ProductRepository productRepository
    ) {
        this.stockRepository = stockRepository;
        this.productRepository = productRepository;
    }

    public StockResponseDto addStockToProduct(Long productId, StockDto dto) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

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
