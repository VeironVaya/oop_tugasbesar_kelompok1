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
        StockResponseDto response = new StockResponseDto();

        if (dto.getSize() == null || dto.getSize().trim().isEmpty()) {
            throw new InvalidDataException("Size is required");
        }
        if (dto.getStockQuantity() <= 0) {
            throw new InvalidDataException("Stock must be non-negative and not 0");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Product not found with id: " + productId));
        Stock stock = stockRepository
                .findByProduct_IdProductAndIgnoreCaseSize(productId, dto.getSize())
                .map(existing -> {
                    // if found, increment the quantity
                    existing.setStock_quantity(
                            existing.getStock_quantity() + dto.getStockQuantity());
                    response.setMessage("new stock quantity updated");
                    response.setStatus("true");

                    return existing;
                })
                .orElseGet(() -> {
                    // otherwise create a new stock entry
                    Stock s = new Stock();
                    s.setProduct(product);
                    s.setSize(dto.getSize());
                    s.setStock_quantity(dto.getStockQuantity());
                    response.setMessage("new stock successfully created");
                    response.setStatus("true");
                    return s;
                });

        Stock saved = stockRepository.save(stock);

        response.setIdStock(saved.getIdStock());
        response.setSize(saved.getSize());
        response.setStockQuantity(saved.getStock_quantity());

        return response;
    }
}
