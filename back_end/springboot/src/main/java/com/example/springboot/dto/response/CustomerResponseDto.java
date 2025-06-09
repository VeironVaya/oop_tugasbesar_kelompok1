package com.example.springboot.dto.response;

import lombok.Getter;
import lombok.Setter;

/**
 * When a client GETs a Customer, you might only want to return:
 *  • idCustomer
 *  • userName
 *
 * If you later need to embed carts, transactions, favorites, etc.,
 * you can add List<CartResponseDto>, List<TransactionHistoryResponseDto>, etc.
 */
@Getter
@Setter
public class CustomerResponseDto {
    private Long idCustomer;
    private String userName;
}
