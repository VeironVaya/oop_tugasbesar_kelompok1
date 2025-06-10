package com.example.springboot.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.springboot.service.CartService;

@RestController
@RequestMapping("/api/v1/customers")
public class TransactionController {
    private final CartService cartService;

    public TransactionController(CartService cartService) {
        this.cartService = cartService;
    }

    // @PostMapping("/{idCustomer}/transaction/stocks/{idStock}")

}
