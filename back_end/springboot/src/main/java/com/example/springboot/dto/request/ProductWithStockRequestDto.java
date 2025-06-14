package com.example.springboot.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductWithStockRequestDto {
    private String name;
    private String description;
    private String urlimage;
    private double price;
    private String category;
    private String size;
    private int stockQuantity;
}
