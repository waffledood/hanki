package com.hanki.backend.service;

import com.hanki.backend.config.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.util.*;
import java.util.function.Function;

@Service
public class JWTService {

    private String secretKey;

    private JwtProperties jwtProperties;

    public JWTService(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
        this.secretKey = jwtProperties.getSecretKey();
    }

    private String generateAccessToken(long currentTime, String username) {
        Map<String, Object> claims = new HashMap<>();

        return Jwts.builder()
                .claims()
                .add(claims)
                .subject(username)
                .issuedAt(new Date(currentTime))
                .expiration(new Date(currentTime + Duration.ofMinutes(jwtProperties.getAccessTokenExpirationMins()).toMillis()))
                .and()
                .signWith(getKey())
                .compact();
    }

    private String generateRefreshToken(long currentTime, String username) {
        Map<String, Object> claims = new HashMap<>();

        return Jwts.builder()
                .claims()
                .add(claims)
                .subject(username)
                .issuedAt(new Date(currentTime))
                .expiration(new Date(currentTime + Duration.ofDays(jwtProperties.getRefreshTokenExpirationDays()).toMillis()))
                .and()
                .signWith(getKey())
                .compact();
    }

    public Map<String, String> generateToken(String username) {

        long currentTime = System.currentTimeMillis();

        String accessToken = generateAccessToken(currentTime, username);

        String refreshToken = generateRefreshToken(currentTime, username);

        return Map.of("access_token", accessToken, "refresh_token", refreshToken);
    }

    public boolean validateToken(String token) {
        try {
            Date expirationDate = extractExpiration(token);

            if (expirationDate.before(new Date(System.currentTimeMillis()))) {
                System.out.println("Token has expired");
                return false;
            }

            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String generateSecretKey() {
        String secretKey = "";

        try {
            KeyGenerator keyGen = KeyGenerator.getInstance("HmacSHA256");
            SecretKey sk = keyGen.generateKey();
            secretKey = Base64.getUrlEncoder().withoutPadding().encodeToString(sk.getEncoded());
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }

        return secretKey;
    }

    private SecretKey getKey() {
        byte[]  keyBytes = Decoders.BASE64URL.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractUserName(String token) {
        // extract the username from jwt token
        return extractClaim(token, Claims::getSubject);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String userName = extractUserName(token);
        return (userName.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}
