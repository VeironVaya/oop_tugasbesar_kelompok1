package com.example.springboot.exception;

public class DuplicateFavoriteException extends RuntimeException {
    public DuplicateFavoriteException(Long productId, Long customerId) {
        super("Favorite for productId: " + productId +
              " and customerId: " + customerId + " already exists");
    }
}
