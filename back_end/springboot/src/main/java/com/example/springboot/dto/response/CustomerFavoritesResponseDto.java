package com.example.springboot.dto.response;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CustomerFavoritesResponseDto {
    private Long idCustomer;
    private List<FavoriteProductResponseDto> favorites;
}
