package com.example.springboot.dto.response;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonPropertyOrder({"idFavoriteProduct", "product" })
public class FavoriteProductResponseDto {
    private Long idFavoriteProduct;

    /**
     * If you want to show full product details in the “favorites” list,
     * embed a ProductResponseDto here.
     */
    private ProductResponseDto product;
}