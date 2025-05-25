package com.hanki.backend.controller;

import com.hanki.backend.dto.UserLoginDto;
import com.hanki.backend.dto.UserPostDto;
import com.hanki.backend.dto.UserResponseDto;
import com.hanki.backend.model.User;
import com.hanki.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
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

    @PostMapping("/register")
    public ResponseEntity<UserResponseDto> registerUser(@Valid @RequestBody UserPostDto userPostDto) {
        User user = authService.registerUser(userPostDto);

        UserResponseDto userResponseDto = new UserResponseDto(user.getId(), user.getUsername(), user.getEmail());

        return ResponseEntity.status(HttpStatus.CREATED).body(userResponseDto);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@Valid @RequestBody UserLoginDto userLoginDto) {
        Map<String, String> accessAndRefreshTokens;

        try {
            accessAndRefreshTokens = authService.verify(userLoginDto);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid credentials"));
        }

        return ResponseEntity.ok(accessAndRefreshTokens);
    }
}
