package com.example.springboot.dto.request;

import lombok.Getter;
import lombok.Setter;

/**
 * Used for adding/removing a FavoriteProduct.
 * idProduct and idCustomer refer to existing Product and Customer IDs.
 */
@Getter
@Setter
public class FavoriteProductDto {
    private Long idProduct;
    private Long idCustomer;
}
