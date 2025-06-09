package com.example.springboot.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class CustomerResponseDto {
    private boolean status;
    private Long idCustomer;
    private String userName;
    private String message;
}
