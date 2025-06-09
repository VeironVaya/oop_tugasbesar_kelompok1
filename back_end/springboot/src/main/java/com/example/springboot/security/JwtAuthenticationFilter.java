package com.example.springboot.security;

import com.example.springboot.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Autowired
    public JwtAuthenticationFilter(JwtService jwtService, UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {
        String path = request.getServletPath();

        // ⛔ Skip filter untuk endpoint publik
        if (path.equals("/api/v1/customers/registration") || path.equals("/api/v1/auth/login/login-admin") || path.equals("/api/v1/products")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        try {
            // 1. Ambil header "Authorization"
            String authHeader = request.getHeader("Authorization");
            String username = null;
            String jwt = null;

            if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
                jwt = authHeader.substring(7);              // potong "Bearer "
                username = jwtService.extractUsername(jwt); // ambil username (subject)
            }

            // 2. Jika username tidak null dan belum ada Authentication di Context
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                // 3. Validasi token
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    // Buat object authentication
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities());

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // Set ke SecurityContext
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception ex) {
            // Jika token invalid atau error lain, kita biarkan saja,
            // request akan gagal di endpoint yang butuh autentikasi.
        }

        // Lanjutkan filter chain
        filterChain.doFilter(request, response);
    }
}