package com.example.springboot.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductWithCustomerResponseDto {
    private String name;
    private String description;
    private Double price;
    private String category;
    private String size;
    private Integer stockQuantity;  
    private Boolean isFavorite;

    public ProductWithCustomerResponseDto(
        String name,
        String description,
        Double price,
        String category,
        String size,
        Long stockQtyLong,
        Integer favInt
    ) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.size = size;
        // Konversi Long ke Integer
        this.stockQuantity = (stockQtyLong != null) ? stockQtyLong.intValue() : null;
        // Konversi Integer (1/0) ke Boolean
        this.isFavorite = (favInt != null && favInt == 1);
    }
}
