package com.example.springboot.security;

import com.example.springboot.service.JwtService;
import com.example.springboot.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.*;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.*;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

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
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())  // nonaktifkan CSRF karena kita pakai token
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // 1) Izinkan siapa pun memanggil GET /api/v1/products
                .requestMatchers(HttpMethod.GET, "/api/v1/products").permitAll()
                // 2) Izinkan login tanpa token
                .requestMatchers(HttpMethod.POST, "/api/v1/auth/login/login-admin").permitAll()
                // 3) Izinkan registrasi customer tanpa token
                .requestMatchers(HttpMethod.POST, "/api/v1/customers/registration").permitAll()
                // 4) Semua endpoint lain wajib autentikasi
                .anyRequest().authenticated()
            )
            // Pasang filter JWT sebelum UsernamePasswordAuthenticationFilter
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
