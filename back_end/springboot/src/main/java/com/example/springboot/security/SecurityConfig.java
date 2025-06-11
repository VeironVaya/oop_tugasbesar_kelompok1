package com.example.springboot.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

import com.example.springboot.service.CustomUserDetailsService;
import com.example.springboot.service.JwtService;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    private final CustomUserDetailsService userDetailsService;
    private final JwtService jwtService;

    @Autowired
    public SecurityConfig(CustomUserDetailsService userDetailsService, JwtService jwtService) {
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
    }

    // 1. Bean untuk encode password (BCrypt)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 2. AuthenticationManager, daftarkan userDetailsService + passwordEncoder
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    // 3. Bean untuk filter JWT
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtService, userDetailsService);
    }

    // 4. Konfigurasi HTTP security
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, CorsConfigurationSource corsConfigurationSource)
            throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(csrf -> csrf.disable()) // nonaktifkan CSRF karena kita pakai token
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .exceptionHandling(ex -> ex
                        // 401 Unauthorized: ketika tidak ada/invalid token
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json");
                            // kirim JSON: {"status":false,"message":"Unauthorized"}
                            String body = "{\"status\":false,\"message\":\"Unauthorized: Full authentication is required to access this resource\"}";
                            response.getWriter().write(body);
                        })
                        // 403 Forbidden: ketika token valid tapi authority tidak cocok
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.setContentType("application/json");
                            // kirim JSON: {"status":false,"message":"Forbidden"}
                            String body = "{\"status\":false,\"message\":\"Forbidden: Access is denied\"}";
                            response.getWriter().write(body);
                        }))

                .authorizeHttpRequests(auth -> auth
                        // Public Endpoints:
                        .requestMatchers(HttpMethod.GET, "/api/v1/products").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/auth/login/login-admin").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/auth/login/login-customer").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/customers/registration").permitAll()

                        // Role-based Endpoints:
                        // .requestMatchers("/api/v1/customers/**").hasRole("CUSTOMER")

                        // Sharing Endpoints

                        .anyRequest().permitAll())

                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
