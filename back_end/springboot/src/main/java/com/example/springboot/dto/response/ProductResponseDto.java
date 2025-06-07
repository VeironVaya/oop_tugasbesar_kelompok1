package com.example.springboot.dto.response;


import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class ProductResponseDto {  
    private Long idProduct;
    private String name;
    private String description;
    private double price;
    private String category;
}
