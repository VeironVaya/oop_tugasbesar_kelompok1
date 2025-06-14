package com.example.springboot.dto.response;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductWithCustomerResponseDto {
    private String status;
    private String message;
    private Long idProduct;
    private String name;
    private String description;
    private String urlimage;
    private Double price;
    private String category;
    private Boolean isFavorite;
    private List<StockResponseDto> stocks;
}
