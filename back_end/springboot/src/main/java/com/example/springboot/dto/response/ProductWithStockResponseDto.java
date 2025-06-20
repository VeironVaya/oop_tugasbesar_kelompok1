package com.example.springboot.dto.response;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

/**
 * When a client GETs a Product, we send back:
 * • idProduct, name, description, price, category
 * • a list of StockResponseDto (size + stockQuantity)
 */
@Getter
@Setter
public class ProductWithStockResponseDto {
    private String status;
    private String message;
    private Long idProduct;
    private String name;
    private String description;
    private String urlimage;
    private double price;
    private String category;
    private List<StockResponseDto> stocks;
}
