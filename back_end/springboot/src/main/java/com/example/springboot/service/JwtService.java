package com.example.springboot.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

    // Ambil nilai secret-key dari application.properties (Base64 encoded)
    @Value("${security.jwt.secret-key}")
    private String secretKey;

    // Ambil durasi expire token (dalam milidetik) dari application.properties
    @Value("${security.jwt.expiration-time}")
    private long jwtExpiration;

    // Mengambil username (subject) dari token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // General method untuk mengambil klaim tertentu
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Generate token hanya berdasarkan UserDetails (misalnya Admin yang implements
    // UserDetails)
    public String generateToken(UserDetails userDetails) {
        return buildToken(userDetails.getUsername());
    }

    // Bangun token tanpa extraClaim (bisa ditambah jika butuh)
    private String buildToken(String subject) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        return Jwts.builder()
                .setSubject(subject) // masukkan username sebagai subject
                .setIssuedAt(now) // waktu dikeluarkan
                .setExpiration(expiryDate) // waktu kadaluarsa
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Validasi token: cek username di token sama dengan username di userDetails,
    // dan belum expired
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    // Cek apakah token sudah kadaluarsa
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Ambil klaim expiration
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Token expired
    public Date getTokenExpirationDate() {
        return new Date(System.currentTimeMillis() + jwtExpiration);
    }

    // Ambil semua klaim (parsing token)
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Ubah secretKey Base64 string menjadi Key objek
    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
