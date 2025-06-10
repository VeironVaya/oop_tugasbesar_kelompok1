package com.example.springboot.controller;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.springboot.dto.request.LoginRequest;
import com.example.springboot.dto.response.LoginResponse;
import com.example.springboot.entity.Admin;
import com.example.springboot.entity.Customer;
import com.example.springboot.service.JwtService;

@RestController
@RequestMapping("/api/v1/auth/login")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager,
            JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    /**
     * Endpoint untuk login Admin:
     * - Memverifikasi username + password
     * - Jika valid, generate token JWT dan kembalikan
     */
    @PostMapping("/login-admin")
    public ResponseEntity<LoginResponse> loginAdmin(@RequestBody LoginRequest loginRequest) {
        try {
            // 1. Autentikasi via AuthenticationManager
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()));

            // 2. Jika berhasil, set ke context
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // 3. Ambil object Admin (karena Admin implements UserDetails)
            Object principal = authentication.getPrincipal();
            if (!(principal instanceof Admin)) {
                throw new BadCredentialsException("Wrong Username or Password");
            }
            Admin admin = (Admin) principal;;

            // 4. Generate JWT via JwtService
            String token = jwtService.generateToken(admin);

            // 5. Hitung waktu kadaluarsa token (Date)
            Date expiredAt = jwtService.getTokenExpirationDate();

            LoginResponse.TokenData tokenData = new LoginResponse.TokenData(token, expiredAt, "Bearer");
            LoginResponse responseBody = new LoginResponse(true, "Login Success", null, tokenData);

            return ResponseEntity.ok(responseBody);
        } catch (BadCredentialsException ex) {
            LoginResponse responseBody = new LoginResponse(false, "Wrong Username or Password", null, null);

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(responseBody);
        }   
    }

    @PostMapping("/login-customer")
    public ResponseEntity<LoginResponse> loginCustomer(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            Object principal = authentication.getPrincipal();
            if (!(principal instanceof Customer)) {
                throw new BadCredentialsException("Wrong Username or Password");
            }
            Customer customer = (Customer) principal;

            String token = jwtService.generateToken(customer);

            Date expiredAt = jwtService.getTokenExpirationDate();

            LoginResponse.TokenData tokenData = new LoginResponse.TokenData(token, expiredAt, "Bearer");
            LoginResponse responseBody = new LoginResponse(true, "Login Success", customer.getIdCustomer(), tokenData);
            
            return ResponseEntity.ok(responseBody);
        } catch (BadCredentialsException ex) {
            LoginResponse responseBody = new LoginResponse(false, "Wrong Username or Password", null, null);

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(responseBody);
        }
    }
}
