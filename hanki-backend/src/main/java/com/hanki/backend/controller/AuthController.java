package com.hanki.backend.controller;

import com.hanki.backend.config.JwtProperties;
import com.hanki.backend.dto.RefreshTokenRequestDto;
import com.hanki.backend.dto.UserLoginDto;
import com.hanki.backend.dto.UserPostDto;
import com.hanki.backend.dto.UserResponseDto;
import com.hanki.backend.enums.JwtConstants;
import com.hanki.backend.model.User;
import com.hanki.backend.service.AuthService;
import com.hanki.backend.service.JWTService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    AuthService authService;

    @Autowired
    JWTService jwtService;

    @Autowired
    JwtProperties jwtProperties;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserPostDto userPostDto) {
        User user = authService.registerUser(userPostDto);

        UserResponseDto userResponseDto = new UserResponseDto(user.getId(), user.getUsername(), user.getEmail());

        return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of(
                        "message", "User registered successfully",
                        "user", userResponseDto
                )
        );
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody UserLoginDto userLoginDto, HttpServletResponse response) {
        boolean userVerified = authService.isUserVerified(userLoginDto);

        if (userVerified) {
            long currentTime = System.currentTimeMillis();
            String username = userLoginDto.getUsername();

            String accessToken = jwtService.generateAccessToken(currentTime, username);
            String refreshToken = jwtService.generateRefreshToken(currentTime, username);

            // Set the cookie using HttpServletResponse
            Cookie cookie = new Cookie("jwt", refreshToken);
            cookie.setHttpOnly(true);
            cookie.setSecure(true);
            cookie.setPath("/");
            cookie.setMaxAge(jwtProperties.getRefreshTokenExpirationDays() * 24 * 60 * 60);
            cookie.setAttribute("SameSite", "None");
            response.addCookie(cookie);

            return ResponseEntity.ok().body(
                    Map.of(JwtConstants.ACCESS_TOKEN.getValue(), accessToken)
            );
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid credentials"));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> refreshAccessToken(@Valid @RequestBody RefreshTokenRequestDto refreshTokenRequest) {
        Map<String, String> accessAndRefreshTokensMap;

        if (authService.validateRefreshToken(refreshTokenRequest.getRefreshToken())) {
            accessAndRefreshTokensMap = authService.refreshAccessToken(refreshTokenRequest.getRefreshToken());

            return ResponseEntity.ok(accessAndRefreshTokensMap);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                "error", "invalid_token",
                "message", "Refresh token has expired")
        );
    }
}
