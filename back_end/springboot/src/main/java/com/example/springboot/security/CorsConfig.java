package com.example.springboot.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // Allow your React dev server origin. In production, replace with your real
        // domain.
        config.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:5174"));
        // Allowed HTTP methods
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        // Allow any header (or restrict to specific headers if you prefer)
        config.setAllowedHeaders(List.of("*"));
        // If you need to allow cookies or Authorization header
        config.setAllowCredentials(true);
        // How long the response to preflight can be cached by browsers
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Apply to your API paths; e.g. all under /api/**
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }
}
