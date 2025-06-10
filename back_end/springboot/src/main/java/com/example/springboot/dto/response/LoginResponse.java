package com.example.springboot.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.util.Date;

@Getter
@AllArgsConstructor
public class LoginResponse {
    private boolean status;
    private String message;
    private Long id;  
    private TokenData data;

    @Getter
    @AllArgsConstructor
    public static class TokenData {
        private String token;
        private Date expiredAt;
        private String tokenType;
    }
}
