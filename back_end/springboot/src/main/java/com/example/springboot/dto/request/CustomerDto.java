package com.example.springboot.dto.request;

import lombok.Getter;
import lombok.Setter;

/**
 * Used for creating/updating a Customer account.
 */
@Getter
@Setter
public class CustomerDto {
    private String userName;
    private String password;
}
