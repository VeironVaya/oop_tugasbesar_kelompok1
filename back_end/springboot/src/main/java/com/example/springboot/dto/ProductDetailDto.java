package com.example.springboot.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductDetailDto {
    private String name;
    private String description;
    private double price;
    private String category;
}
