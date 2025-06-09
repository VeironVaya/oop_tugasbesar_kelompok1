package com.example.springboot.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SimpleResponseDto {
    private String message;
    private Boolean status;
}
