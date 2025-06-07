package com.example.springboot.controller;

import com.example.springboot.entity.Admin;
import com.example.springboot.dto.request.LoginRequest;
import com.example.springboot.dto.response.LoginResponse;
import com.example.springboot.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.Date;

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
                            loginRequest.getPassword()
                    )
            );

            // 2. Jika berhasil, set ke context
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // 3. Ambil object Admin (karena Admin implements UserDetails)
            Admin admin = (Admin) authentication.getPrincipal();

            // 4. Generate JWT via JwtService
            String token = jwtService.generateToken(admin);

            // 5. Hitung waktu kadaluarsa token (Date)
            Date expiredAt = jwtService.getTokenExpirationDate();

            LoginResponse.TokenData tokenData = new LoginResponse.TokenData(token, expiredAt, "Bearer");
            LoginResponse responseBody = new LoginResponse(true, "Login Success", tokenData);

            return ResponseEntity.ok(responseBody);
        } catch (BadCredentialsException ex) {
            LoginResponse responseBody = new LoginResponse(false, "Login Failed", null);

            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(responseBody);
        }
    }
}
