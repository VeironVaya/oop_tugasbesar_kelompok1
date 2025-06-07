package com.example.springboot.dto.response;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class FavoriteProductResponseDto {
    private Long idFavoriteProduct;

    /** 
     * If you want to show full product details in the “favorites” list,
     * embed a ProductResponseDto here.
     */
    private ProductResponseDto product;
}
