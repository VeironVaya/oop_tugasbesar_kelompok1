package com.example.springboot.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductDto {
    private String name;
    private String description;
    private double price;
    private String category;
    private String size;
    private int stockQuantity;
}

