package com.example.springboot.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddRemoveFavoriteResponseDto {
    private boolean status;
    private String message;
    @JsonProperty("isFavorite")
    private boolean favorite;
}
